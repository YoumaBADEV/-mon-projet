<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produit;
use App\Models\Vente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    // GET /api/commandes
    // Acheteur : ses commandes. Agriculteur : commandes sur SES produits. Admin : toutes.
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Commande::with('produit', 'acheteur')->latest();

        if ($user->role === 'agriculteur') {
            $query->whereHas('produit', fn ($q) => $q->where('agriculteur_id', $user->id));
        } elseif ($user->role === 'acheteur') {
            $query->where('acheteur_id', $user->id);
        }

        return response()->json($query->get());
    }

    // POST /api/commandes : passerCommande()
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'acheteur') {
            return response()->json(['message' => 'Seul un acheteur peut passer une commande.'], 403);
        }

        $validated = $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite_commande' => 'required|numeric|min:0.01',
        ]);

        $produit = Produit::findOrFail($validated['produit_id']);

        if ($produit->statut !== 'disponible') {
            return response()->json(['message' => 'Ce produit n\'est pas disponible.'], 422);
        }

        if ($validated['quantite_commande'] > $produit->quantite) {
            return response()->json([
                'message' => 'Quantité demandée supérieure au stock disponible.',
                'stock_disponible' => $produit->quantite,
            ], 422);
        }

        $commande = Commande::create([
            'produit_id' => $produit->id,
            'acheteur_id' => $request->user()->id,
            'quantite_commande' => $validated['quantite_commande'],
            'prix_total' => round($validated['quantite_commande'] * $produit->prix_propose, 2),
            'statut' => 'en_attente',
        ]);

        return response()->json($commande->load('produit', 'acheteur'), 201);
    }

    // PUT /api/commandes/{commande}/annuler : annulerCommande()
    public function annuler(Request $request, Commande $commande): JsonResponse
    {
        if ($commande->acheteur_id !== $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez annuler que vos commandes.'], 403);
        }

        if ($commande->statut !== 'en_attente') {
            return response()->json(['message' => 'Seule une commande en attente peut être annulée.'], 422);
        }

        $commande->update(['statut' => 'annulee']);

        return response()->json($commande->load('produit', 'acheteur'));
    }

    // PUT /api/commandes/{commande}/confirmer : confirmerCommande() (par l'agriculteur)
    public function confirmer(Request $request, Commande $commande): JsonResponse
    {
        $commande->load('produit');

        if ($request->user()->role !== 'agriculteur'
            || $commande->produit->agriculteur_id !== $request->user()->id) {
            return response()->json(['message' => 'Seul l\'agriculteur propriétaire peut confirmer.'], 403);
        }

        return DB::transaction(function () use ($commande) {
            $commande = Commande::lockForUpdate()->findOrFail($commande->id);

            if ($commande->statut !== 'en_attente') {
                return response()->json(['message' => 'Cette commande n\'est plus en attente.'], 422);
            }

            $produit = Produit::lockForUpdate()->findOrFail($commande->produit_id);

            if ($produit->statut !== 'disponible' || $commande->quantite_commande > $produit->quantite) {
                return response()->json([
                    'message' => 'Stock insuffisant pour confirmer cette commande.',
                    'stock_disponible' => $produit->quantite,
                ], 422);
            }

            // La confirmation déclenche la vente (met aussi à jour l'historique des prix)
            Vente::create([
                'produit_id' => $produit->id,
                'acheteur_id' => $commande->acheteur_id,
                'quantite_achetee' => $commande->quantite_commande,
                'prix_final' => $commande->prix_total,
            ]);

            $produit->quantite = $produit->quantite - $commande->quantite_commande;
            if ($produit->quantite <= 0) {
                $produit->statut = 'vendu';
            }
            $produit->save();

            $commande->update(['statut' => 'confirmee']);

            return response()->json($commande->load('produit', 'acheteur'));
        });
    }
}

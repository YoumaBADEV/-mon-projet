<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Vente;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class VenteController extends Controller
{
    // GET /api/ventes
    // Agriculteur : les ventes de SES produits. Autres : leurs propres achats.
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Vente::with('produit', 'acheteur')->latest();

        if ($user->role === 'agriculteur') {
            $query->whereHas('produit', fn ($q) => $q->where('agriculteur_id', $user->id));
        } else {
            $query->where('acheteur_id', $user->id);
        }

        return response()->json($query->get());
    }

    // POST /api/ventes
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'acheteur') {
            return response()->json(['message' => 'Seul un acheteur peut effectuer un achat.'], 403);
        }

        $validated = $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite_achetee' => 'required|numeric|min:0.01',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            // lockForUpdate : evite que deux achats simultanes depassent le stock
            $produit = Produit::lockForUpdate()->findOrFail($validated['produit_id']);

            if ($produit->statut !== 'disponible') {
                return response()->json(['message' => 'Ce produit n\'est plus disponible.'], 422);
            }

            if ($validated['quantite_achetee'] > $produit->quantite) {
                return response()->json([
                    'message' => 'Quantite demandee superieure au stock disponible.',
                    'stock_disponible' => $produit->quantite,
                ], 422);
            }

            // Prix calcule par le serveur, jamais lu dans la requete
            $vente = Vente::create([
                'produit_id' => $produit->id,
                'acheteur_id' => $request->user()->id,
                'quantite_achetee' => $validated['quantite_achetee'],
                'prix_final' => round($validated['quantite_achetee'] * $produit->prix_propose, 2),
            ]);

            $produit->quantite = $produit->quantite - $validated['quantite_achetee'];
            if ($produit->quantite <= 0) {
                $produit->statut = 'vendu';
            }
            $produit->save();

            return response()->json($vente->load('produit', 'acheteur'), 201);
        });
    }

    // GET /api/ventes/{id}
    // Visible par l'acheteur concerne ou par l'agriculteur proprietaire du produit
    public function show(Request $request, Vente $vente): JsonResponse
    {
        $vente->load('produit', 'acheteur');
        $userId = $request->user()->id;

        if ($vente->acheteur_id !== $userId && $vente->produit->agriculteur_id !== $userId) {
            return response()->json(['message' => 'Acces non autorise.'], 403);
        }

        return response()->json($vente);
    }
}
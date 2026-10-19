<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Vente;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VenteController extends Controller
{
    // GET /api/ventes
    public function index(Request $request): JsonResponse
    {
        $ventes = Vente::with('produit', 'acheteur')
            ->where('acheteur_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($ventes);
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
            'prix_final' => 'required|numeric|min:0',
        ]);

        $produit = Produit::findOrFail($validated['produit_id']);

        if ($produit->statut !== 'disponible') {
            return response()->json(['message' => 'Ce produit n\'est plus disponible.'], 422);
        }

        if ($validated['quantite_achetee'] > $produit->quantite) {
            return response()->json([
                'message' => 'Quantite demandee superieure au stock disponible.',
                'stock_disponible' => $produit->quantite,
            ], 422);
        }

        $validated['acheteur_id'] = $request->user()->id;
        $vente = Vente::create($validated);

        $nouvelleQuantite = $produit->quantite - $validated['quantite_achetee'];
        $produit->quantite = $nouvelleQuantite;

        if ($nouvelleQuantite <= 0) {
            $produit->statut = 'vendu';
        }

        $produit->save();

        return response()->json($vente->load('produit', 'acheteur'), 201);
    }

    // GET /api/ventes/{id}
    public function show(Request $request, Vente $vente): JsonResponse
    {
        if ($vente->acheteur_id !== $request->user()->id) {
            return response()->json(['message' => 'Acces non autorise.'], 403);
        }

        return response()->json($vente->load('produit', 'acheteur'));
    }
}
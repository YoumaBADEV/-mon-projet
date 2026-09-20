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
    public function index(): JsonResponse
    {
        $ventes = Vente::with('produit', 'acheteur')->latest()->get();
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
            'quantite_achetee' => 'required|numeric|min:0',
            'prix_final' => 'required|numeric|min:0',
        ]);

        $validated['acheteur_id'] = $request->user()->id;

        $vente = Vente::create($validated);

        $produit = Produit::find($validated['produit_id']);
        if ($produit && $validated['quantite_achetee'] >= $produit->quantite) {
            $produit->update(['statut' => 'vendu']);
        }

        return response()->json($vente->load('produit', 'acheteur'), 201);
    }

    // GET /api/ventes/{id}
    public function show(Vente $vente): JsonResponse
    {
        return response()->json($vente->load('produit', 'acheteur'));
    }
}
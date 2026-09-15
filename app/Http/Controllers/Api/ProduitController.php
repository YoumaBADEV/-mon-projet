<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProduitController extends Controller
{
    // GET /api/produits
    public function index(): JsonResponse
    {
        $produits = Produit::with('agriculteur')->where('statut', 'disponible')->get();
        return response()->json($produits);
    }

    // POST /api/produits
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'agriculteur_id' => 'required|exists:users,id',
            'nom_produit' => 'required|string|max:255',
            'quantite' => 'required|numeric|min:0',
            'unite' => 'nullable|string|max:20',
            'prix_propose' => 'required|numeric|min:0',
            'localisation' => 'nullable|string|max:255',
        ]);

        $produit = Produit::create($validated);
        return response()->json($produit, 201);
    }

    // GET /api/produits/{id}
    public function show(Produit $produit): JsonResponse
    {
        return response()->json($produit->load('agriculteur', 'ventes'));
    }

    // PUT/PATCH /api/produits/{id}
    public function update(Request $request, Produit $produit): JsonResponse
    {
        $validated = $request->validate([
            'nom_produit' => 'sometimes|string|max:255',
            'quantite' => 'sometimes|numeric|min:0',
            'prix_propose' => 'sometimes|numeric|min:0',
            'statut' => 'sometimes|in:disponible,vendu',
        ]);

        $produit->update($validated);
        return response()->json($produit);
    }

    // DELETE /api/produits/{id}
    public function destroy(Produit $produit): JsonResponse
    {
        $produit->delete();
        return response()->json(null, 204);
    }
}
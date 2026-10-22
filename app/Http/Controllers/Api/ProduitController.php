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
        $produits = Produit::with('agriculteur', 'categorie')->where('statut', 'disponible')->get();
        return response()->json($produits);
    }

    // POST /api/produits
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'agriculteur') {
            return response()->json(['message' => 'Seul un agriculteur peut publier un produit.'], 403);
        }

        $validated = $request->validate([
            'nom_produit' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'categorie_id' => 'nullable|exists:categories,id',
            'quantite' => 'required|numeric|min:0',
            'unite' => 'nullable|string|max:20',
            'prix_propose' => 'required|numeric|min:0',
            'localisation' => 'nullable|string|max:255',
        ]);

        $validated['agriculteur_id'] = $request->user()->id;

        $produit = Produit::create($validated);
        return response()->json($produit->load('categorie'), 201);
    }

    // GET /api/produits/{id}
    public function show(Produit $produit): JsonResponse
    {
        return response()->json($produit->load('agriculteur', 'categorie', 'ventes'));
    }

    // PUT/PATCH /api/produits/{id}
    public function update(Request $request, Produit $produit): JsonResponse
    {
        if ($produit->agriculteur_id !== $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez modifier que vos propres produits.'], 403);
        }

        $validated = $request->validate([
            'nom_produit' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string|max:2000',
            'categorie_id' => 'sometimes|nullable|exists:categories,id',
            'quantite' => 'sometimes|numeric|min:0',
            'prix_propose' => 'sometimes|numeric|min:0',
            'statut' => 'sometimes|in:disponible,vendu',
        ]);

        $produit->update($validated);
        return response()->json($produit->load('categorie'));
    }

    // DELETE /api/produits/{id}
    public function destroy(Request $request, Produit $produit): JsonResponse
    {
        if ($produit->agriculteur_id !== $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez supprimer que vos propres produits.'], 403);
        }

        $produit->delete();
        return response()->json(null, 204);
    }
}

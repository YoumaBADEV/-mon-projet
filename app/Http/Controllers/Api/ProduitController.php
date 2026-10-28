<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProduitController extends Controller
{
    // GET /api/produits : afficher les produits validés
    public function index(): JsonResponse
    {
        $produits = Produit::with('agriculteur', 'categorie')
            ->where('statut', 'disponible')
            ->get();

        return response()->json($produits);
    }

    // GET /api/mes-produits : tous les produits de l'agriculteur connecté
    // (vendus, en attente et refusés inclus)
    public function mesProduits(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'agriculteur') {
            return response()->json(['message' => 'Reserve aux agriculteurs.'], 403);
        }

        $produits = Produit::with('categorie')
            ->where('agriculteur_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($produits);
    }

    // POST /api/produits : proposer un produit
    public function store(Request $request): JsonResponse
    {
        if (!$request->user() ||
            $request->user()->role !== 'agriculteur') {
            return response()->json([
                'message' => 'Seul un agriculteur connecté peut proposer un produit.'
            ], 403);
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
        $validated['statut'] = 'en_attente';

        $produit = Produit::create($validated);

        return response()->json([
            'message' => 'Produit soumis pour validation.',
            'produit' => $produit->load('categorie')
        ], 201);
    }

    // GET /api/produits/{produit}
    public function show(Produit $produit): JsonResponse
    {
        return response()->json(
            $produit->load('agriculteur', 'categorie', 'ventes')
        );
    }

    // PUT/PATCH /api/produits/{produit}
    public function update(
        Request $request,
        Produit $produit
    ): JsonResponse {
        if (!$request->user() ||
            $produit->agriculteur_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez modifier que vos propres produits.'
            ], 403);
        }

        $validated = $request->validate([
            'nom_produit' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string|max:2000',
            'categorie_id' => 'sometimes|nullable|exists:categories,id',
            'quantite' => 'sometimes|required|numeric|min:0',
            'unite' => 'sometimes|nullable|string|max:20',
            'prix_propose' => 'sometimes|required|numeric|min:0',
            'localisation' => 'sometimes|nullable|string|max:255',
        ]);

        // L'agriculteur ne peut pas changer le statut
        $produit->update($validated);

        return response()->json($produit->load('categorie'));
    }

    // DELETE /api/produits/{produit}
    public function destroy(
        Request $request,
        Produit $produit
    ): JsonResponse {
        if (!$request->user() ||
            $produit->agriculteur_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez supprimer que vos propres produits.'
            ], 403);
        }

        $produit->delete();

        return response()->json(null, 204);
    }

    // GET /api/admin/produits/en-attente
    public function produitsEnAttente(Request $request): JsonResponse
    {
        if (!$request->user() ||
            $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès réservé à l’administrateur.'
            ], 403);
        }

        $produits = Produit::with('agriculteur')
            ->where('statut', 'en_attente')
            ->get();

        return response()->json($produits);
    }

    // PUT /api/admin/produits/{produit}/valider
    public function validerProduit(
        Request $request,
        Produit $produit
    ): JsonResponse {
        if (!$request->user() ||
            $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès réservé à l’administrateur.'
            ], 403);
        }

        if ($produit->statut !== 'en_attente') {
            return response()->json([
                'message' => 'Ce produit n’est pas en attente de validation.'
            ], 422);
        }

        $produit->update(['statut' => 'disponible']);

        return response()->json([
            'message' => 'Produit validé avec succès.',
            'produit' => $produit
        ]);
    }

    // PUT /api/admin/produits/{produit}/refuser
    public function refuserProduit(
        Request $request,
        Produit $produit
    ): JsonResponse {
        if (!$request->user() ||
            $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès réservé à l’administrateur.'
            ], 403);
        }

        if ($produit->statut !== 'en_attente') {
            return response()->json([
                'message' => 'Ce produit n’est pas en attente de validation.'
            ], 422);
        }

        $produit->update(['statut' => 'refuse']);

        return response()->json([
            'message' => 'Produit refusé.',
            'produit' => $produit
        ]);
    }
}
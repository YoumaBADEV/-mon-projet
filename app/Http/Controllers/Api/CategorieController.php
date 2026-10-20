<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategorieController extends Controller
{
    // GET /api/categories
    public function index(): JsonResponse
    {
        return response()->json(Categorie::orderBy('nom')->get());
    }

    // POST /api/categories
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Seul un admin peut creer une categorie.'], 403);
        }

        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:categories,nom',
            'description' => 'nullable|string|max:1000',
        ]);

        $categorie = Categorie::create($validated);
        return response()->json($categorie, 201);
    }

    // GET /api/categories/{categorie}
    public function show(Categorie $categorie): JsonResponse
    {
        return response()->json($categorie->load('produits'));
    }

    // PUT/PATCH /api/categories/{categorie}
    public function update(Request $request, Categorie $categorie): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Seul un admin peut modifier une categorie.'], 403);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255|unique:categories,nom,' . $categorie->id,
            'description' => 'nullable|string|max:1000',
        ]);

        $categorie->update($validated);
        return response()->json($categorie);
    }

    // DELETE /api/categories/{categorie}
    public function destroy(Request $request, Categorie $categorie): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Seul un admin peut supprimer une categorie.'], 403);
        }

        $categorie->delete();
        return response()->json(null, 204);
    }
}
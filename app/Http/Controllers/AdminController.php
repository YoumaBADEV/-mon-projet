<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Toutes les actions sont réservées à l'administrateur connecté
    private function refuser(Request $request): ?JsonResponse
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès réservé à l’administrateur.'], 403);
        }
        return null;
    }

    // GET /api/admin/users : afficher tous les utilisateurs
    public function index(Request $request)
    {
        if ($refus = $this->refuser($request)) return $refus;

        return response()->json(User::all());
    }

    // GET /api/admin/users/{id}
    public function show(Request $request, $id)
    {
        if ($refus = $this->refuser($request)) return $refus;

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        return response()->json($user);
    }

    // PUT /api/admin/users/{id} : modifier un utilisateur
    public function update(Request $request, $id)
    {
        if ($refus = $this->refuser($request)) return $refus;

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:agriculteur,acheteur,admin',
        ]);

        $user->update($request->only(['nom', 'prenom', 'email', 'role']));

        return response()->json([
            'message' => 'Utilisateur modifié avec succès',
            'user' => $user,
        ]);
    }

    // DELETE /api/admin/users/{id} : supprimer un utilisateur
    public function destroy(Request $request, $id)
    {
        if ($refus = $this->refuser($request)) return $refus;

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(null, 204);
    }
}

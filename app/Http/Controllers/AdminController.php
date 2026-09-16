<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Afficher tous les utilisateurs
    public function index()
    {
        $users = User::all();

        return response()->json($users);
    }

    // Afficher un utilisateur par son ID
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable'
            ], 404);
        }

        return response()->json($user);
    }

    // Modifier un utilisateur
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable'
            ], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:user,admin',
        ]);

        $user->update($request->only([
            'name',
            'email',
            'role'
        ]));

        return response()->json([
            'message' => 'Utilisateur modifié avec succès',
            'user' => $user
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\User;
use App\Models\Vente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    // GET /api/admin/stats (reserve a l'administrateur)
    public function index(Request $request): JsonResponse
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès réservé à l’administrateur.'], 403);
        }

        return response()->json([
            'utilisateurs' => [
                'total' => User::count(),
                'agriculteurs' => User::where('role', 'agriculteur')->count(),
                'acheteurs' => User::where('role', 'acheteur')->count(),
                'admins' => User::where('role', 'admin')->count(),
            ],
            'produits' => [
                'total' => Produit::count(),
                'en_attente' => Produit::where('statut', 'en_attente')->count(),
                'disponible' => Produit::where('statut', 'disponible')->count(),
                'vendu' => Produit::where('statut', 'vendu')->count(),
                'refuse' => Produit::where('statut', 'refuse')->count(),
            ],
            'ventes' => [
                'total' => Vente::count(),
                'chiffre_affaires' => (float) Vente::sum('prix_final'),
            ],
        ]);
    }
}

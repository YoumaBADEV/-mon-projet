<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HistoriquePrix;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HistoriquePrixController extends Controller
{
    // GET /api/historique-prix?nom_produit=Tomate
    public function index(Request $request): JsonResponse
    {
        $query = HistoriquePrix::query();

        if ($request->has('nom_produit')) {
            $query->where('nom_produit', $request->nom_produit);
        }

        $historique = $query->orderBy('date_calcul', 'desc')->get();
        return response()->json($historique);
    }
}
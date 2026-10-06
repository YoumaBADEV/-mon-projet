<?php

namespace App\Http\Controllers;

use App\Models\PriceHistory;
use Illuminate\Http\Request;

class PriceHistoryController extends Controller
{
    // Afficher tout l'historique des prix
    public function index()
    {
        $histories = PriceHistory::orderBy('changed_at', 'desc')->get();

        return response()->json($histories);
    }

    // Ajouter une nouvelle entrée dans l'historique
    public function store(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'changed_at' => 'nullable|date',
        ]);

        $history = PriceHistory::create([
            'product_name' => $request->product_name,
            'price' => $request->price,
            'changed_at' => $request->changed_at ?? now(),
        ]);

        return response()->json([
            'message' => 'Historique du prix ajouté avec succès',
            'history' => $history
        ], 201);
    }

    // Afficher l'historique d'un produit précis
    public function productHistory($product_name)
    {
        $histories = PriceHistory::where('product_name', $product_name)
            ->orderBy('changed_at', 'asc')
            ->get();

        return response()->json($histories);
    }
}

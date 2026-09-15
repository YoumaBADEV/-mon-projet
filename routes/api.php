<?php

use App\Http\Controllers\Api\ProduitController;
use App\Http\Controllers\Api\VenteController;
use App\Http\Controllers\Api\HistoriquePrixController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('produits', ProduitController::class);
Route::apiResource('ventes', VenteController::class)->only(['index', 'store', 'show']);
Route::get('historique-prix', [HistoriquePrixController::class, 'index']);
<?php

use App\Http\Controllers\Api\ProduitController;
use App\Http\Controllers\Api\VenteController;
use App\Http\Controllers\Api\HistoriquePrixController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PriceHistoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ====================
// ROUTES PUBLIQUES
// ====================

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::get('produits', [ProduitController::class, 'index']);
Route::get('produits/{produit}', [ProduitController::class, 'show']);

Route::get('historique-prix', [HistoriquePrixController::class, 'index']);


// ====================
// ROUTES PROTÉGÉES
// ====================

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('logout', [AuthController::class, 'logout']);

    // Produits
    Route::post('produits', [ProduitController::class, 'store']);
    Route::put('produits/{produit}', [ProduitController::class, 'update']);
    Route::patch('produits/{produit}', [ProduitController::class, 'update']);
    Route::delete('produits/{produit}', [ProduitController::class, 'destroy']);

    // Ventes
    Route::apiResource('ventes', VenteController::class)
        ->only(['index', 'store', 'show']);
});


// ====================
// ROUTES ADMIN
// ====================

Route::get('/admin/users', [AdminController::class, 'index']);

Route::get('/admin/users/{id}', [AdminController::class, 'show']);

Route::put('/admin/users/{id}', [AdminController::class, 'update']);

Route::delete('/admin/users/{id}', [AdminController::class, 'destroy']);


// ====================
// HISTORIQUE DES PRIX
// ====================

Route::get('/price-histories', [PriceHistoryController::class, 'index']);

Route::post('/price-histories', [PriceHistoryController::class, 'store']);

Route::get('/price-histories/{product_name}', [PriceHistoryController::class, 'productHistory']);
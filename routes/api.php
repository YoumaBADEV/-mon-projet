<?php

use App\Http\Controllers\Api\ProduitController;
use App\Http\Controllers\Api\VenteController;
use App\Http\Controllers\Api\HistoriquePrixController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\CommandeController;
use App\Http\Controllers\Api\GroupeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PriceHistoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ====================
// ROUTES PUBLIQUES
// ====================

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Vérification de l'email (lien signé envoyé par mail)
Route::get('email/verify/{id}/{hash}', [AuthController::class, 'verifierEmail'])
    ->middleware('signed')
    ->name('verification.verify');
Route::post('email/renvoyer', [AuthController::class, 'renvoyerVerification'])
    ->middleware('throttle:3,1');

Route::get('produits', [ProduitController::class, 'index']);
Route::get('produits/{produit}', [ProduitController::class, 'show']);

Route::get('historique-prix', [HistoriquePrixController::class, 'index']);

Route::get('categories', [CategorieController::class, 'index']);
Route::get('categories/{categorie}', [CategorieController::class, 'show']);


// ====================
// ROUTES PROTÉGÉES
// ====================

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('logout', [AuthController::class, 'logout']);

    // Produits
    Route::get('mes-produits', [ProduitController::class, 'mesProduits']);
    Route::post('produits', [ProduitController::class, 'store']);
    Route::put('produits/{produit}', [ProduitController::class, 'update']);
    Route::patch('produits/{produit}', [ProduitController::class, 'update']);
    Route::delete('produits/{produit}', [ProduitController::class, 'destroy']);

    // Ventes
    Route::apiResource('ventes', VenteController::class)
        ->only(['index', 'store', 'show']);

    // Commandes (passer / annuler par l'acheteur, confirmer par l'agriculteur)
    Route::get('commandes', [CommandeController::class, 'index']);
    Route::post('commandes', [CommandeController::class, 'store']);
    Route::put('commandes/{commande}/annuler', [CommandeController::class, 'annuler']);
    Route::put('commandes/{commande}/confirmer', [CommandeController::class, 'confirmer']);

    // Groupes d'agriculteurs (creer / modifier / participer)
    Route::get('groupes', [GroupeController::class, 'index']);
    Route::get('groupes/{groupe}', [GroupeController::class, 'show']);
    Route::post('groupes', [GroupeController::class, 'store']);
    Route::put('groupes/{groupe}', [GroupeController::class, 'update']);
    Route::post('groupes/{groupe}/participer', [GroupeController::class, 'participer']);
    Route::delete('groupes/{groupe}/participer', [GroupeController::class, 'quitter']);

    // Categories (creation/modification/suppression reservees a l'admin, verifie dans le controleur)
    Route::post('categories', [CategorieController::class, 'store']);
    Route::put('categories/{categorie}', [CategorieController::class, 'update']);
    Route::patch('categories/{categorie}', [CategorieController::class, 'update']);
    Route::delete('categories/{categorie}', [CategorieController::class, 'destroy']);

    // ====================
    // VALIDATION DES PRODUITS PAR L'ADMINISTRATEUR
    // ====================

    Route::get('admin/stats', [StatsController::class, 'index']);

    Route::get('admin/produits/en-attente', [
        ProduitController::class,
        'produitsEnAttente'
    ]);

    Route::put('admin/produits/{produit}/valider', [
        ProduitController::class,
        'validerProduit'
    ]);

    Route::put('admin/produits/{produit}/refuser', [
        ProduitController::class,
        'refuserProduit'
    ]);

    // ====================
    // ADMINISTRATION DES UTILISATEURS (role admin verifie dans le controleur)
    // ====================

    Route::get('admin/users', [AdminController::class, 'index']);
    Route::get('admin/users/{id}', [AdminController::class, 'show']);
    Route::put('admin/users/{id}', [AdminController::class, 'update']);
    Route::delete('admin/users/{id}', [AdminController::class, 'destroy']);

    // ====================
    // HISTORIQUE DES PRIX (ancien systeme, connexion obligatoire)
    // ====================

    Route::get('price-histories', [PriceHistoryController::class, 'index']);
    Route::post('price-histories', [PriceHistoryController::class, 'store']);
    Route::get('price-histories/{product_name}', [
        PriceHistoryController::class,
        'productHistory'
    ]);
});
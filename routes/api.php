<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PriceHistoryController;

Route::get('/admin/users', [AdminController::class, 'index']);

Route::get('/admin/users/{id}', [AdminController::class, 'show']);

Route::put('/admin/users/{id}', [AdminController::class, 'update']);

Route::delete('/admin/users/{id}', [AdminController::class, 'destroy']);

Route::get('/price-histories', [PriceHistoryController::class, 'index']);

Route::post('/price-histories', [PriceHistoryController::class, 'store']);

Route::get('/price-histories/{product_name}', [PriceHistoryController::class, 'productHistory']);

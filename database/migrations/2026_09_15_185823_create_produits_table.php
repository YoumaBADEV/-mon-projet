<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agriculteur_id')->constrained('users')->onDelete('cascade');
            $table->string('nom_produit');
            $table->decimal('quantite', 10, 2);
            $table->string('unite')->default('kg');
            $table->decimal('prix_propose', 10, 2);
            $table->string('localisation')->nullable();
            $table->enum('statut', ['disponible', 'vendu'])->default('disponible');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
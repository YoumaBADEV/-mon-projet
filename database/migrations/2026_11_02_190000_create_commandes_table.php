<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produit_id')->constrained('produits')->onDelete('cascade');
            $table->foreignId('acheteur_id')->constrained('users')->onDelete('cascade');
            $table->decimal('quantite_commande', 10, 2);
            $table->decimal('prix_total', 12, 2);
            $table->string('statut', 20)->default('en_attente'); // en_attente, confirmee, annulee
            $table->timestamp('date_commande')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historique_prix', function (Blueprint $table) {
            $table->id();
            $table->string('nom_produit');
            $table->decimal('prix_moyen', 10, 2);
            $table->string('region')->nullable();
            $table->date('date_calcul');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historique_prix');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            $table->enum('statut', [
                'en_attente',
                'disponible',
                'vendu',
                'refuse'
            ])->default('en_attente')->change();
        });
    }

    public function down(): void
    {
        // Convertir les nouveaux statuts avant le retour
        // à l'ancienne liste de valeurs.
        DB::table('produits')
            ->whereIn('statut', ['en_attente', 'refuse'])
            ->update(['statut' => 'disponible']);

        Schema::table('produits', function (Blueprint $table) {
            $table->enum('statut', [
                'disponible',
                'vendu'
            ])->default('disponible')->change();
        });
    }
};

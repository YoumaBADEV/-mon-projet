<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nom')->nullable()->after('name');
            $table->string('prenom')->nullable()->after('nom');
            $table->string('adresse')->nullable()->after('localisation');
            $table->string('matricule')->nullable()->unique()->after('adresse');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nom', 'prenom', 'adresse', 'matricule']);
        });
    }
};
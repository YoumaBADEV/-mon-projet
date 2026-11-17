<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('groupes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->foreignId('createur_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Classe d'association "Participer" : agriculteur <-> groupe
        Schema::create('participations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('groupe_id')->constrained('groupes')->onDelete('cascade');
            $table->foreignId('agriculteur_id')->constrained('users')->onDelete('cascade');
            $table->string('role', 30)->default('membre'); // responsable, membre
            $table->timestamp('date_adhesion')->useCurrent();
            $table->timestamps();

            $table->unique(['groupe_id', 'agriculteur_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('participations');
        Schema::dropIfExists('groupes');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->enum('role', ['agriculteur', 'acheteur', 'admin'])
                      ->default('agriculteur')
                      ->after('email');
            });
        }

        if (!Schema::hasColumn('users', 'telephone')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('telephone')->nullable()->after('role');
            });
        }

        if (!Schema::hasColumn('users', 'localisation')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('localisation')->nullable()->after('telephone');
            });
        }
    }

    public function down(): void
    {
        foreach (['role', 'telephone', 'localisation'] as $column) {
            if (Schema::hasColumn('users', $column)) {
                Schema::table('users', function (Blueprint $table) use ($column) {
                    $table->dropColumn($column);
                });
            }
        }
    }
};
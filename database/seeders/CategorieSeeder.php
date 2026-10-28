<?php

namespace Database\Seeders;

use App\Models\Categorie;
use Illuminate\Database\Seeder;

class CategorieSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['nom' => 'Légumes', 'description' => 'Produits maraîchers'],
            ['nom' => 'Fruits', 'description' => 'Fruits frais'],
            ['nom' => 'Céréales', 'description' => 'Mil, maïs, riz, sorgho...'],
            ['nom' => 'Tubercules', 'description' => 'Manioc, patate douce, igname...'],
            ['nom' => 'Épices', 'description' => 'Piment, gingembre, poivre...'],
            ['nom' => 'Légumineuses', 'description' => 'Arachide, niébé, haricots...'],
        ];

        foreach ($categories as $categorie) {
            // firstOrCreate : on peut relancer le seeder sans creer de doublons
            Categorie::firstOrCreate(['nom' => $categorie['nom']], $categorie);
        }
    }
}
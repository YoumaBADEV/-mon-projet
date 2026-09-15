<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriquePrix extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_produit',
        'prix_moyen',
        'region',
        'date_calcul',
    ];

    protected $casts = [
        'prix_moyen' => 'decimal:2',
        'date_calcul' => 'date',
    ];

    /**
     * Calcule et enregistre le prix moyen d'un produit
     * à partir de toutes les ventes enregistrées.
     */
    public static function mettreAJourPrixMoyen(string $nomProduit): void
    {
        $prixMoyen = Vente::whereHas('produit', function ($query) use ($nomProduit) {
            $query->where('nom_produit', $nomProduit);
        })->avg('prix_final');

        if ($prixMoyen !== null) {
            self::create([
                'nom_produit' => $nomProduit,
                'prix_moyen' => round($prixMoyen, 2),
                'date_calcul' => now()->toDateString(),
            ]);
        }
    }
}
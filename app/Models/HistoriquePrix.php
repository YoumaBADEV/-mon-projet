<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriquePrix extends Model
{
    use HasFactory;

    protected $table = 'historique_prix';

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
     * Prix moyen par unite (ex: par kg) = total des ventes / total des quantites vendues.
     */
    public static function mettreAJourPrixMoyen(string $nomProduit): void
    {
        $stats = Vente::whereHas('produit', function ($query) use ($nomProduit) {
            $query->where('nom_produit', $nomProduit);
        })
            ->selectRaw('SUM(prix_final) as total_prix, SUM(quantite_achetee) as total_quantite')
            ->first();

        if ($stats && $stats->total_quantite > 0) {
            self::create([
                'nom_produit' => $nomProduit,
                'prix_moyen' => round($stats->total_prix / $stats->total_quantite, 2),
                'date_calcul' => now()->toDateString(),
            ]);
        }
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vente extends Model
{
    use HasFactory;

    protected $fillable = [
        'produit_id',
        'acheteur_id',
        'quantite_achetee',
        'prix_final',
        'date_vente',
    ];

    protected $casts = [
        'quantite_achetee' => 'decimal:2',
        'prix_final' => 'decimal:2',
        'date_vente' => 'datetime',
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function acheteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'acheteur_id');
    }

    // Recalcule automatiquement le prix moyen à chaque nouvelle vente
    protected static function booted(): void
    {
        static::created(function (Vente $vente) {
            HistoriquePrix::mettreAJourPrixMoyen($vente->produit->nom_produit);
        });
    }
}
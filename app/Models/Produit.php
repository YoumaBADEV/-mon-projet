<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    use HasFactory;

    protected $fillable = [
        'agriculteur_id',
        'nom_produit',
        'quantite',
        'unite',
        'prix_propose',
        'localisation',
        'statut',
    ];

    protected $casts = [
        'quantite' => 'decimal:2',
        'prix_propose' => 'decimal:2',
    ];

    public function agriculteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agriculteur_id');
    }

    public function ventes(): HasMany
    {
        return $this->hasMany(Vente::class);
    }
}
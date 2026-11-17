<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'produit_id',
        'acheteur_id',
        'quantite_commande',
        'prix_total',
        'statut',
        'date_commande',
    ];

    protected $casts = [
        'quantite_commande' => 'decimal:2',
        'prix_total' => 'decimal:2',
        'date_commande' => 'datetime',
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function acheteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'acheteur_id');
    }
}

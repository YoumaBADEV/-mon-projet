<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Participer extends Model
{
    use HasFactory;

    protected $table = 'participations';

    protected $fillable = ['groupe_id', 'agriculteur_id', 'role', 'date_adhesion'];

    protected $casts = ['date_adhesion' => 'datetime'];

    public function groupe(): BelongsTo
    {
        return $this->belongsTo(Groupe::class);
    }

    public function agriculteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agriculteur_id');
    }
}

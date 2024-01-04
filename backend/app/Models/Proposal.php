<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proposal extends Model
{
    use HasFactory;
    protected $table = 'proposals';

    public function opinions(): HasMany
    {
        return $this->hasMany(Opinions::class);
    }
    public function track(): BelongsTo
    {
        return $this->belongsTo(Track::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Proposal extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'proposals';

    public function opinions(): HasMany
    {
        return $this->hasMany(Opinion::class);
    }
    public function track(): BelongsTo
    {
        return $this->belongsTo(Track::class);
    }
}

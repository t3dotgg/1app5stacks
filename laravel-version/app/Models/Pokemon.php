<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Number;

class Pokemon extends Model
{
    public function win(): HasMany
    {
        return $this->hasMany(Vote::class, 'winner_id');
    }

    public function loss(): HasMany
    {
        return $this->hasMany(Vote::class, 'loser_id');
    }

    public function getWinPercentageAttribute(): string
    {
        if ($this->win_count + $this->loss_count === 0) return "0.0%";
        return Number::percentage($this->win_count / ($this->win_count + $this->loss_count) * 100, 1);
    }


    public static function fetch(int $count): array
    {
        return static::inRandomOrder()->limit($count)->get()
            ->map(fn(Pokemon $pokemon) => (object)$pokemon->toArray())->all();
    }

    public static function results(bool $limit): Collection
    {
        return static::query()->withCount(['win', 'loss'])
            ->when($limit, fn($query) => $query->limit(50))->get()
            ->map(fn(Pokemon $pokemon) => (object)$pokemon->append('win_percentage')->toArray());
    }
}

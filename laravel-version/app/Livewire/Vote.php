<?php

namespace App\Livewire;

use App\Models\Pokemon;
use Livewire\Component;

class Vote extends Component
{
    public array $pokemons;
    public array $nextTen;

    public function mount(): void
    {
        $this->pokemons = Pokemon::fetch(2);
        $this->nextTen = Pokemon::fetch(10);
    }

    public function vote(int $index): \Illuminate\Http\RedirectResponse
    {
        \App\Models\Vote::insert([
            'winner_id' => $this->pokemons[$index]->id,
            'loser_id' => $this->pokemons[1 - $index % 2]->id]);

        $this->pokemons = \Arr::take($this->nextTen, 2);
        $this->nextTen = [
            ...\Arr::except($this->nextTen, [0, 1]),
            ...Pokemon::fetch(2)
        ];

        return redirect()->back();
    }

    public function render(): \Illuminate\View\View
    {
        return view('livewire.vote');
    }
}

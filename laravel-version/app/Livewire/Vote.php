<?php

namespace App\Livewire;

use App\Models\Pokemon;
use Livewire\Attributes\Session;
use Livewire\Component;

class Vote extends Component
{
    #[Session]
    public array $pokemons;
    #[Session]
    public array $nextTwo;

    public function mount(): void
    {
        $this->pokemons ??= Pokemon::fetch(2);
        $this->nextTwo ??= Pokemon::fetch(2);
    }

    public function vote(int $index): \Illuminate\Http\RedirectResponse
    {
        \App\Models\Vote::insert([
            'winner_id' => $this->pokemons[$index]->id,
            'loser_id' => $this->pokemons[1 - $index % 2]->id]);

        $this->pokemons = $this->nextTwo;
        $this->nextTwo = Pokemon::fetch(2);

        return redirect()->back();
    }

    public function render(): \Illuminate\View\View
    {
        return view('livewire.vote');
    }
}
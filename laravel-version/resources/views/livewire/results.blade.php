<div class="container mx-auto px-4 py-8 text-white">
    <div class="grid gap-4">
        @foreach($this->pokemons as $pokemon)
            <div class="flex items-center gap-6 p-6 bg-gray-800/40 rounded-lg shadow hover:shadow-md transition-shadow">
                <div class="text-2xl font-bold text-gray-400 w-8">
                    #{{ $pokemon->id }}
                </div>
                <img src="{{ $pokemon->url }}" alt="{{ $pokemon->name }}" class="w-20 h-20" loading="lazy"/>
                <div class="flex-grow">
                    <div class="text-gray-400 text-sm">#{{ $pokemon->id }}</div>
                    <h2 class="text-xl font-semibold capitalize">{{ $pokemon->name }}</h2>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-blue-400">
                        {{$pokemon->win_percentage}}
                    </div>
                    <div class="text-sm text-gray-400">
                        {{ $pokemon->win_count }}W - {{ $pokemon->loss_count }}L
                    </div>
                </div>
            </div>
        @endforeach
        <div wire:init="loadMore"/>
    </div>
</div>

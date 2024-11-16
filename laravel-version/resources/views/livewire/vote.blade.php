<div class="container mx-auto px-4">
    <div class="flex justify-center gap-16 items-center min-h-[80vh]">
        @foreach ($this->pokemons as $index => $pokemon)
            <div class="flex flex-col items-center gap-4">
                <img wire:replace.self src="{{ $pokemon->url }}" class="w-64 h-64" style="image-rendering: pixelated"/>
                <div class=" text-center">
                    <span class="text-gray-500 text-lg">#{{ $pokemon->id  }}</span>
                    <h2 class="text-2xl font-bold capitalize">{{ $pokemon->name  }}</h2>
                    <button wire:click="vote({{ $index }})"
                            class="px-8 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50">
                        Vote
                    </button>
                </div>
            </div>
        @endforeach
        @foreach ($this->nextTen as $index => $pokemon)
            <link rel="preload" fetchpriority="high" as="image" href="{{$this->nextTen[$index]->url}}">
        @endforeach
    </div>
</div>

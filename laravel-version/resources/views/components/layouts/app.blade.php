<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <title>Rounded - Livewire</title>
    @vite(['resources/css/app.css'])
</head>
<body>
<div class="bg-gray-950 text-white flex flex-col justify-between font-geist min-h-screen border-t-2 border-red-500">
    <nav class="flex flex-row justify-between items-center py-4 px-8">
        <div class="flex items-baseline">
            <a wire:navigate.hover href="{{route('home')}}" class="text-3xl font-bold">
                round<span class="text-red-500">est</span>
            </a>
            <p class="text-gray-400 font-extralight pl-2 text-2xl">
                Laravel Livewire
            </p>
        </div>
        <div class="flex flex-row items-center gap-8">
            <a wire:navigate.hover href="{{route('results')}}">
                Results
            </a>
        </div>
    </nav>

    <main>
        {{ $slot }}
    </main>

    <footer class="font-light text-center py-3 text-gray-500">
        <a href="https://github.com/t3dotgg/1app5stacks" target="_blank">GitHub</a>
    </footer>
</div>
</body>
</html>

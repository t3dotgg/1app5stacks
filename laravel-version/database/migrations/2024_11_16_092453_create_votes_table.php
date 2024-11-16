<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->integer('winner_id');
            $table->integer('loser_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};

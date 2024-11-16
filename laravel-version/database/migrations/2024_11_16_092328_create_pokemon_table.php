<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pokemon', function (Blueprint $table) {
            $table->integer('id');
            $table->string('name');
            $table->string('url');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pokemon');
    }
};

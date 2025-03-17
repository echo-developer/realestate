<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::rename('old_table1', 'new_table1');
        Schema::rename('old_table2', 'new_table2');
        Schema::rename('old_table3', 'new_table3');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('new_table1', 'old_table1');
        Schema::rename('new_table2', 'old_table2');
        Schema::rename('new_table3', 'old_table3');
    }
};

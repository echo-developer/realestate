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
        Schema::table('pref_properties', function (Blueprint $table) {
            $table->integer('is_favorite')->default(0)->after('is_populer')->comment('0 = not favorite, 1 = favorite');;
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pref_properties', function (Blueprint $table) {
            $table->dropColumn('is_favorite');
        });
    }
};

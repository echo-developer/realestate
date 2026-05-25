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
        Schema::table('user_additional_data', function (Blueprint $table) {
            if (!Schema::hasColumn('user_additional_data', 'locality')) {
                $table->string('locality')->nullable()->after('city');
            }
        });
    }

    public function down(): void
    {
        Schema::table('user_additional_data', function (Blueprint $table) {
            if (Schema::hasColumn('user_additional_data', 'locality')) {
                $table->dropColumn('locality');
            }
        });
    }
};

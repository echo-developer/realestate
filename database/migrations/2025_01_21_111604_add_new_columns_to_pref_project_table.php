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
        Schema::table('pref_project', function (Blueprint $table) {
            $table->boolean('is_deleted')->default(0)->after('status');
            $table->boolean('is_featured')->default(0)->after('is_deleted');
            $table->integer('views')->default(0)->after('is_featured');
            $table->boolean('is_popular')->default(0)->after('views');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pref_project', function (Blueprint $table) {
            $table->dropColumn('is_deleted');
            $table->dropColumn('is_featured');
            $table->dropColumn('views');
            $table->dropColumn('is_popular');
        });
    }
};

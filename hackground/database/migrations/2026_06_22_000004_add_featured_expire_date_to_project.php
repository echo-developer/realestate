<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project', function (Blueprint $table) {
            $table->timestamp('featured_expire_date')->nullable()->after('is_featured');
        });
    }

    public function down(): void
    {
        Schema::table('project', function (Blueprint $table) {
            $table->dropColumn('featured_expire_date');
        });
    }
};

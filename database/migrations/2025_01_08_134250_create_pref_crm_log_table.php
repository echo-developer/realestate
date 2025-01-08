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
        Schema::create('pref_crm_log', function (Blueprint $table) {
            $table->id();
            $table->integer('enquiry_id')->nullable();
            $table->integer('status')->default(1);
            $table->dateTime('schedule_date')->nullable();
            $table->string('remarks')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_crm_log');
    }
};

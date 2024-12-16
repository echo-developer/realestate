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
        Schema::create('pref_user_password_resets', function (Blueprint $table) {
            $table->id(); 
            $table->integer('user_id'); 
            $table->string('otp'); 
            $table->timestamp('expires_at')->useCurrent()->useCurrentOnUpdate(); // Expiration time
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_user_password_resets');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Convert existing typo value if present
        DB::statement("UPDATE friendships SET statut = 'en_attente' WHERE statut = 'en_sattente'");

        // Fix enum definition (MySQL)
        DB::statement("ALTER TABLE friendships MODIFY statut ENUM('en_attente','accepte','bloque') NOT NULL DEFAULT 'en_attente'");
    }

    public function down(): void
    {
        // Revert enum definition back to the previous (typo) value
        DB::statement("UPDATE friendships SET statut = 'en_sattente' WHERE statut = 'en_attente'");
        DB::statement("ALTER TABLE friendships MODIFY statut ENUM('en_sattente','accepte','bloque') NOT NULL DEFAULT 'en_sattente'");
    }
};


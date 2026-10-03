<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('registration_source', ['self_registration', 'admin_created'])
                ->default('self_registration')
                ->after('status');

            $table->foreignId('created_by_admin_id')
                ->nullable()
                ->after('registration_source')
                ->constrained('users')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->index('registration_source', 'idx_users_reg_source');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['created_by_admin_id']);
            $table->dropIndex('idx_users_reg_source');
            $table->dropColumn(['registration_source', 'created_by_admin_id']);
        });
    }
};

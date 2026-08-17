<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_follow_ups', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lead_id')
                ->constrained('leads')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->foreignId('admin_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->enum('status', [
                'contacted',
                'follow_up',
                'interested',
                'rented',
                'lost',
                'not_interested',
            ]);

            $table->text('notes')->nullable();

            $table->timestamp('next_follow_up_at')->nullable();
            $table->timestamp('contacted_at')->nullable();

            $table->timestamp('created_at')->nullable()->useCurrent();

            $table->index('lead_id', 'idx_lead_follow_ups_lead');
            $table->index('admin_id', 'idx_lead_follow_ups_admin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_follow_ups');
    }
};

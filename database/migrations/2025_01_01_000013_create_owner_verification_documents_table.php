<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('owner_verification_documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('verification_id')
                ->constrained('owner_verifications')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->enum('document_type', ['identity', 'ownership', 'bank_account', 'other']);

            $table->string('file_url', 500);
            $table->string('original_filename', 255)->nullable();
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();

            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index('verification_id', 'idx_owner_verification_documents_verification');
            $table->index('document_type', 'idx_owner_verification_documents_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('owner_verification_documents');
    }
};

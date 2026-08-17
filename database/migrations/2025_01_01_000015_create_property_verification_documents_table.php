<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_verification_documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('verification_id')
                ->constrained('property_verifications')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->enum('document_type', ['ownership', 'address', 'other']);

            $table->string('file_url', 500);
            $table->string('original_filename', 255)->nullable();
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();

            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index('verification_id', 'idx_property_verification_documents_verification');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_verification_documents');
    }
};

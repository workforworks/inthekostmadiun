<?php

use App\Models\AuditLog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

test('unauthenticated user cannot access owner management page', function () {
    $response = $this->get(route('admin.owners.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin user cannot access owner management or create owner', function () {
    $userRole = Role::firstOrCreate(['name' => 'user'], ['description' => 'User']);
    $regularUser = User::factory()->create(['role_id' => $userRole->id]);

    $response = $this->actingAs($regularUser)->get(route('admin.owners.index'));
    $response->assertForbidden();

    $createResponse = $this->actingAs($regularUser)->post(route('admin.owners.store'), [
        'name' => 'New Owner',
        'email' => 'newowner@example.com',
        'phone' => '081234567899',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);
    $createResponse->assertForbidden();
});

test('admin can view owner management index page', function () {
    $adminRole = Role::firstOrCreate(['name' => 'admin'], ['description' => 'Admin']);
    $admin = User::factory()->create(['role_id' => $adminRole->id]);

    $response = $this->actingAs($admin)->get(route('admin.owners.index'));
    $response->assertOk();
});

test('admin can create owner account with active status and admin_created source', function () {
    Storage::fake('public');

    $adminRole = Role::firstOrCreate(['name' => 'admin'], ['description' => 'Admin']);
    $ownerRole = Role::firstOrCreate(['name' => 'owner'], ['description' => 'Owner']);
    $admin = User::factory()->create(['role_id' => $adminRole->id]);

    $avatar = UploadedFile::fake()->image('owner_avatar.jpg');

    $payload = [
        'name' => 'Pak Haji Slamet',
        'email' => 'slamet.kost@example.com',
        'phone' => '081298765432',
        'password' => 'secret1234',
        'password_confirmation' => 'secret1234',
        'address' => 'Jl. Pahlawan No. 100, Madiun',
        'avatar' => $avatar,
    ];

    $response = $this->actingAs($admin)->post(route('admin.owners.store'), $payload);

    $response->assertRedirect(route('admin.owners.index'));
    $response->assertSessionHas('success', 'Akun Owner berhasil dibuat.');

    // Assert User created
    $owner = User::where('email', 'slamet.kost@example.com')->first();
    expect($owner)->not->toBeNull();
    expect($owner->name)->toBe('Pak Haji Slamet');
    expect($owner->phone)->toBe('081298765432');
    expect($owner->role_id)->toBe($ownerRole->id);
    expect($owner->status)->toBe('active');
    expect($owner->registration_source)->toBe('admin_created');
    expect($owner->created_by_admin_id)->toBe($admin->id);
    expect(Hash::check('secret1234', $owner->password))->toBeTrue();

    // Assert UserProfile and OwnerProfile created
    expect($owner->userProfile)->not->toBeNull();
    expect($owner->userProfile->address)->toBe('Jl. Pahlawan No. 100, Madiun');
    expect($owner->ownerProfile)->not->toBeNull();
    expect($owner->ownerProfile->verification_status)->toBe('verified');

    // Assert Audit Log recorded
    $auditLog = AuditLog::where('action', 'CREATE_OWNER')
        ->where('entity_id', $owner->id)
        ->first();
    expect($auditLog)->not->toBeNull();
    expect($auditLog->user_id)->toBe($admin->id);
});

test('created owner account can login with the provided credentials', function () {
    $adminRole = Role::firstOrCreate(['name' => 'admin'], ['description' => 'Admin']);
    $ownerRole = Role::firstOrCreate(['name' => 'owner'], ['description' => 'Owner']);
    $admin = User::factory()->create(['role_id' => $adminRole->id]);

    $this->actingAs($admin)->post(route('admin.owners.store'), [
        'name' => 'Ibu Siti Aminah',
        'email' => 'siti.aminah@example.com',
        'phone' => '081233445566',
        'password' => 'securePass123',
        'password_confirmation' => 'securePass123',
    ]);

    // Logout admin
    auth()->logout();

    // Attempt login as new owner
    $loginResponse = $this->post(route('login'), [
        'email' => 'siti.aminah@example.com',
        'password' => 'securePass123',
    ]);

    $this->assertAuthenticated();
    $loginResponse->assertRedirect(route('owner.dashboard'));
});

test('creation validation fails on duplicate email or phone or invalid phone format', function () {
    $adminRole = Role::firstOrCreate(['name' => 'admin'], ['description' => 'Admin']);
    $ownerRole = Role::firstOrCreate(['name' => 'owner'], ['description' => 'Owner']);
    $admin = User::factory()->create(['role_id' => $adminRole->id]);

    // Existing user
    User::factory()->create([
        'email' => 'existing@example.com',
        'phone' => '081234567890',
        'role_id' => $ownerRole->id,
    ]);

    $response = $this->actingAs($admin)->post(route('admin.owners.store'), [
        'name' => 'Test Duplicate',
        'email' => 'existing@example.com',
        'phone' => '081234567890',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertSessionHasErrors(['email', 'phone']);
});

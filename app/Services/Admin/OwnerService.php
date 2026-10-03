<?php

namespace App\Services\Admin;

use App\Models\AuditLog;
use App\Models\OwnerProfile;
use App\Models\Role;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class OwnerService
{
    /**
     * Get paginated owners with optional filters.
     */
    public function getPaginatedOwners(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $ownerRole = Role::where('name', 'owner')->first();

        $query = User::query()
            ->where('role_id', $ownerRole?->id)
            ->with(['userProfile', 'ownerProfile', 'createdByAdmin']);

        // Filter search (name, email, phone)
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('userProfile', function ($profileQ) use ($search) {
                        $profileQ->where('address', 'like', "%{$search}%");
                    });
            });
        }

        // Filter status
        if (! empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        // Filter registration_source
        if (! empty($filters['registration_source']) && $filters['registration_source'] !== 'all') {
            $query->where('registration_source', $filters['registration_source']);
        }

        return $query->latest('id')->paginate($perPage)->withQueryString();
    }

    /**
     * Create a new owner account by Admin.
     */
    public function createOwnerByAdmin(array $data, int $adminId, Request $request): User
    {
        return DB::transaction(function () use ($data, $adminId, $request) {
            $ownerRole = Role::where('name', 'owner')->firstOrFail();

            // 1. Create User with role 'owner' and status 'active'
            $user = User::create([
                'role_id' => $ownerRole->id,
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password' => Hash::make($data['password']),
                'status' => 'active',
                'registration_source' => 'admin_created',
                'created_by_admin_id' => $adminId,
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
            ]);

            // 2. Handle avatar upload if present
            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
            }

            // 3. Create User Profile
            UserProfile::create([
                'user_id' => $user->id,
                'address' => $data['address'] ?? null,
                'avatar' => $avatarPath ? Storage::url($avatarPath) : null,
            ]);

            // 4. Create Owner Profile with verified status (admin created)
            OwnerProfile::create([
                'user_id' => $user->id,
                'business_name' => $data['name'],
                'verification_status' => 'verified',
                'verified_at' => now(),
            ]);

            // 5. Create Audit Log
            AuditLog::create([
                'user_id' => $adminId,
                'action' => 'CREATE_OWNER',
                'entity_type' => User::class,
                'entity_id' => $user->id,
                'old_values' => null,
                'new_values' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => 'owner',
                    'status' => 'active',
                    'registration_source' => 'admin_created',
                    'created_by_admin_id' => $adminId,
                    'address' => $data['address'] ?? null,
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $user;
        });
    }

    /**
     * Get summary statistics for owners.
     */
    public function getOwnerStats(): array
    {
        $ownerRole = Role::where('name', 'owner')->first();
        if (! $ownerRole) {
            return [
                'total' => 0,
                'admin_created' => 0,
                'self_registration' => 0,
                'active' => 0,
            ];
        }

        $baseQuery = User::where('role_id', $ownerRole->id);

        return [
            'total' => (clone $baseQuery)->count(),
            'admin_created' => (clone $baseQuery)->where('registration_source', 'admin_created')->count(),
            'self_registration' => (clone $baseQuery)->where('registration_source', 'self_registration')->count(),
            'active' => (clone $baseQuery)->where('status', 'active')->count(),
        ];
    }

    /**
     * Toggle the active status of the specified owner.
     */
    public function toggleOwnerStatus(User $owner, int $adminId, Request $request): void
    {
        $oldStatus = $owner->status;
        $newStatus = $oldStatus === 'active' ? 'inactive' : 'active';

        $owner->update(['status' => $newStatus]);

        AuditLog::create([
            'user_id' => $adminId,
            'action' => 'TOGGLE_OWNER_STATUS',
            'entity_type' => User::class,
            'entity_id' => $owner->id,
            'old_values' => ['status' => $oldStatus],
            'new_values' => ['status' => $newStatus],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);
    }

    /**
     * Update the verification status of the owner's profile.
     * Status: pending | verified | rejected | suspended
     */
    public function updateVerificationStatus(User $owner, string $newStatus, int $adminId, Request $request): void
    {
        $ownerProfile = $owner->ownerProfile;

        if (! $ownerProfile) {
            $ownerProfile = OwnerProfile::create([
                'user_id' => $owner->id,
                'verification_status' => 'pending',
            ]);
        }

        $oldStatus = $ownerProfile->verification_status;

        $ownerProfile->update([
            'verification_status' => $newStatus,
            'verified_at' => $newStatus === 'verified' ? now() : $ownerProfile->verified_at,
        ]);

        AuditLog::create([
            'user_id' => $adminId,
            'action' => 'UPDATE_OWNER_VERIFICATION',
            'entity_type' => User::class,
            'entity_id' => $owner->id,
            'old_values' => ['verification_status' => $oldStatus],
            'new_values' => ['verification_status' => $newStatus],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);
    }

    /**
     * Update the account status of the specified owner.
     * Status: active | inactive | suspended
     */
    public function updateAccountStatus(User $owner, string $newStatus, int $adminId, Request $request): void
    {
        $oldStatus = $owner->status;

        $owner->update(['status' => $newStatus]);

        AuditLog::create([
            'user_id' => $adminId,
            'action' => 'UPDATE_OWNER_ACCOUNT_STATUS',
            'entity_type' => User::class,
            'entity_id' => $owner->id,
            'old_values' => ['status' => $oldStatus],
            'new_values' => ['status' => $newStatus],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);
    }
}


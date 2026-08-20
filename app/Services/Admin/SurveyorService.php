<?php

namespace App\Services\Admin;

use App\Models\Surveyor;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SurveyorService
{
    /**
     * Get paginated surveyors with search and filter capabilities.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedSurveyors(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Surveyor::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('area', 'like', "%{$search}%");
            });
        }

        if (isset($filters['status']) && $filters['status'] !== '' && $filters['status'] !== 'all') {
            $isActive = $filters['status'] === 'active';
            $query->where('is_active', $isActive);
        }

        return $query->latest('id')->paginate($perPage)->withQueryString();
    }

    /**
     * Create a new surveyor record.
     *
     * @param array $data
     * @return Surveyor
     */
    public function createSurveyor(array $data): Surveyor
    {
        return Surveyor::create([
            'name' => $data['name'],
            'phone' => $data['phone'],
            'area' => $data['area'],
            'is_active' => $data['is_active'] ?? true,
            'notes' => $data['notes'] ?? null,
        ]);
    }

    /**
     * Update an existing surveyor record.
     *
     * @param Surveyor $surveyor
     * @param array $data
     * @return Surveyor
     */
    public function updateSurveyor(Surveyor $surveyor, array $data): Surveyor
    {
        $surveyor->update([
            'name' => $data['name'],
            'phone' => $data['phone'],
            'area' => $data['area'],
            'is_active' => $data['is_active'] ?? $surveyor->is_active,
            'notes' => $data['notes'] ?? null,
        ]);

        return $surveyor;
    }

    /**
     * Toggle status active/inactive for a surveyor.
     *
     * @param Surveyor $surveyor
     * @return Surveyor
     */
    public function toggleSurveyorStatus(Surveyor $surveyor): Surveyor
    {
        $surveyor->update([
            'is_active' => !$surveyor->is_active,
        ]);

        return $surveyor;
    }

    /**
     * Delete a surveyor.
     *
     * @param Surveyor $surveyor
     * @return bool|null
     */
    public function deleteSurveyor(Surveyor $surveyor): ?bool
    {
        return $surveyor->delete();
    }
}

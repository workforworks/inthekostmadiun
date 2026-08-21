<?php

namespace App\Services\Admin;

use App\Models\SurveyChecklist;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SurveyChecklistService
{
    /**
     * Get paginated or filtered list of survey checklists.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedChecklists(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = SurveyChecklist::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['category']) && $filters['category'] !== 'all') {
            $query->where('category', $filters['category']);
        }

        if (isset($filters['status']) && $filters['status'] !== '' && $filters['status'] !== 'all') {
            $isActive = $filters['status'] === 'active';
            $query->where('is_active', $isActive);
        }

        return $query->orderBy('category')
                     ->orderBy('order', 'asc')
                     ->orderBy('id', 'asc')
                     ->paginate($perPage)
                     ->withQueryString();
    }

    /**
     * Get all active checklists grouped by category for report generation.
     *
     * @return Collection
     */
    public function getActiveGroupedByCategory(): Collection
    {
        return SurveyChecklist::active()
            ->orderBy('category')
            ->orderBy('order', 'asc')
            ->get()
            ->groupBy('category');
    }

    /**
     * Create a new survey checklist item.
     *
     * @param array $data
     * @return SurveyChecklist
     */
    public function createChecklist(array $data): SurveyChecklist
    {
        return SurveyChecklist::create([
            'name' => $data['name'],
            'category' => $data['category'],
            'description' => $data['description'] ?? null,
            'order' => $data['order'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    /**
     * Update an existing survey checklist item.
     *
     * @param SurveyChecklist $checklist
     * @param array $data
     * @return SurveyChecklist
     */
    public function updateChecklist(SurveyChecklist $checklist, array $data): SurveyChecklist
    {
        $checklist->update([
            'name' => $data['name'],
            'category' => $data['category'],
            'description' => $data['description'] ?? null,
            'order' => $data['order'] ?? $checklist->order,
            'is_active' => $data['is_active'] ?? $checklist->is_active,
        ]);

        return $checklist;
    }

    /**
     * Toggle status active/inactive for a survey checklist.
     *
     * @param SurveyChecklist $checklist
     * @return SurveyChecklist
     */
    public function toggleChecklistStatus(SurveyChecklist $checklist): SurveyChecklist
    {
        $checklist->update([
            'is_active' => !$checklist->is_active,
        ]);

        return $checklist;
    }

    /**
     * Delete a survey checklist item.
     *
     * @param SurveyChecklist $checklist
     * @return bool|null
     */
    public function deleteChecklist(SurveyChecklist $checklist): ?bool
    {
        return $checklist->delete();
    }
}

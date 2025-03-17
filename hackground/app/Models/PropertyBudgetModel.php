<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PropertyBudgetModel extends Model
{
    public function createBudget(array $data)
    {

        $budgetId = DB::table('property_budget')->insert([

            'order' => $data['order'],
            'status' => $data['status'],
            'max_budget' => $data['max_budget'],
            'min_budget' => $data['min_budget'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        set_flash_message('add');

        return [
            'message' => 'Budget added successfully.',
            'budget_id' => $budgetId
        ];
    }

    public function getbudgets($term = null,$peginate)
    {
        $query = DB::table('property_budget')
            ->where([
                ['property_budget.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'property_budget.id',
                'property_budget.max_budget',
                'property_budget.min_budget',
                'property_budget.order',
                'property_budget.status',
            );
        if ($term) {
            $query->where('property_budget.max_budget', 'like', "{$term}")
            ->orwhere('property_budget.min_budget', 'like', "{$term}");
        }
        return $query->paginate($peginate);
    }


    public function getBudgetDetails($id)
    {
        $Budget = DB::table('property_budget')
            ->where('property_budget.id', '=', $id) 
            ->select(
                'property_budget.id as budget_id',
                'property_budget.max_budget',
                'property_budget.min_budget',
                'property_budget.order',
                'property_budget.status', 
            )
            ->get();

        return $Budget;
    }

    public function updateBudget($data)
    {
        // Start a budget to ensure atomicity
        DB::beginTransaction();

        try {
            // Update the category data in the property_budget table
            $budgetData = [
                'order' => $data['order'],
                'status' => $data['status'],
                'max_budget' => $data['max_budget'],
                'min_budget' => $data['min_budget'],
                'updated_at' => now(),
            ];

            DB::table('property_budget')
                ->where('id', $data['budget_id'])
                ->update($budgetData);

            // Commit the budget
            DB::commit();
            set_flash_message('update');

            return [
                'message' => 'Budget updated successfully.',
                'budget_id' => $data['budget_id'],
            ];
        } catch (\Exception $e) {
            // Rollback the budget in case of an error
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }

    public function BudgetstatusUpdate($data)
    {
        DB::table('property_budget')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'Budget status updated.',
        ];
    }

    public function DeleteBudget($id = '')
    {
        DB::table('property_budget')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
            set_flash_message('delete');
        return [
            'message' => 'Budget deleted successfully.',
        ];
    }
    use HasFactory;
}

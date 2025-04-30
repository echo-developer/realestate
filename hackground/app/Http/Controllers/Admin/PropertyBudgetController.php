<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PropertyBudgetModel;
use Illuminate\Http\Request;

class PropertyBudgetController extends Controller
{
    protected $budgetModel;


    public function __construct(PropertyBudgetModel $budgetModel)
    {
        $this->budgetModel = $budgetModel;
        $this->middleware('view_permit:property-budget');
    }

    public function PropertybudgetView(Request $request)
    {
        $peginate = 10;
        $term = $request->input('term');
        $data = $this->budgetModel->getbudgets($term,$peginate);
        return view('Admin.Property_Setting.property_budget', compact('data'));

    }


    public function AddBudget(Request $req)
    {


        $rules = [

            'status' => 'required|boolean',
            'id' => 'nullable|integer',
            'max_budget' => 'required|integer',
            'min_budget' => 'required|integer',
        ];

        $messages = [

            'max_budget.required' => 'The Max Budget is required.',
            'min_budget.required' => 'The Min Budget is required.',
            'status.required' => 'The Status field is required.',
            'id.required' => 'The ID field is required.',
        ];


        $validated = $req->validate($rules, $messages);
        $validated['order'] = $req->input('order', null);

        try {
            $response = $this->budgetModel->createBudget($validated);
            set_flash_message('add');
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function Budgetdetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Budget ID is required.'], 400);
        }

        $data = $this->budgetModel->getBudgetDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Budget not found.'], 404);
        }

        return response()->json($data);
    }

    public function EditBudget(Request $req)
    {
        $rules = [

            'max_budget' => 'required|integer',
            'min_budget' => 'required|integer',
            'status' => 'required|boolean',
            'prop_budgetId' => 'required|integer|exists:property_budget,id',  // Ensure category exists
        ];

        // Custom validation messages (same as add category)
        $messages = [

            'max_budget.required' => 'The Max Budget is required.',
            'min_budget.required' => 'The Min Budget is required.',
            'status.required' => 'The Status field is required.',
            'prop_budgetId.exists' => 'The specified Category ID does not exist.',
        ];


        // Validate the request (same as add category)
        $validated = $req->validate($rules, $messages);
        $validated['order'] = $req->input('order', null);

        // Prepare the data for the update (same as add category)
        $data = [
            'budget_id' => $req->prop_budgetId,
            'order' => $validated['order'],
            'status' => $validated['status'],
            'max_budget' => $validated['max_budget'],
            'min_budget' => $validated['min_budget'],
        ];
        try {
            // Call the method to update the category in the model
            $response = $this->budgetModel->updateBudget($data);
            set_flash_message('update');

            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function Budgetstatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->budgetModel->BudgetstatusUpdate($data);
        return response()->json($response);
    }

    public function Budgetdelete(Request $req)
    {
        $response = $this->budgetModel->DeleteBudget($req->id);
        set_flash_message('delete');
        return response()->json($response);
    }
}

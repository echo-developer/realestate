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
    }

    public function PropertybudgetView(Request $request)
    {
        $term = $request->input('term');
        // $data = $this->budgetModel->getbudgets($term);
        return view('Admin\Property_Setting\property_budget');
        // , compact('data')
    }
}

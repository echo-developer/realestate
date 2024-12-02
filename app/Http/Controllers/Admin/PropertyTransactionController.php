<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PropertyTransactionModel;
use Illuminate\Http\Request;

class PropertyTransactionController extends Controller
{
    protected $transactionModel;

   
    public function __construct(PropertyTransactionModel $transactionModel)
    {
        $this->transactionModel = $transactionModel;
    }

    public function PropertytransactionView(Request $request)
    {
        $peginate = 10;
        $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        $data = $this->transactionModel->gettransactions($term,$lang,$peginate);
        return view('Admin\Property_Setting\property_transaction', compact('data'));
    }

    public function AddTransaction(Request $req)
    {
        $langs = array_keys($req->input('name', []));


        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'id' => 'nullable|integer',
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
            'id.required' => 'The ID field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);

        try {
            $response = $this->transactionModel->createTransaction($validated);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function Transactiondetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Furnish ID is required.'], 400);
        }

        $data = $this->transactionModel->getTransactionDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Category not found.'], 404);
        }

        return response()->json($data);
    }


    public function EditTransaction(Request $req)
    {

        // Get the languages from the input data
        $langs = array_keys($req->input('name', []));

        // Validation rules (same as add category)
        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'prop_transactionId' => 'required|integer|exists:pref_property_transaction,id',  // Ensure category exists
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        // Custom validation messages (same as add category)
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
            'prop_transactionId.required' => 'The Category ID field is required.',
            'prop_transactionId.exists' => 'The specified Category ID does not exist.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        // Validate the request (same as add category)
        $validated = $req->validate($rules, $messages);

        // Prepare the data for the update (same as add category)
        $data = [
            'transaction_id' => $req->prop_transactionId,
            'name' => $validated['name'],
            'order' => $validated['order'],
            'status' => $validated['status'],
        ];
        try {
            // Call the method to update the category in the model
            $response = $this->transactionModel->updatetransaction($data);

            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function Transactionstatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->transactionModel->TransactionstatusUpdate($data);
        return response()->json($response);
    }

    public function Transactiondelete(Request $req)
    {
        $response = $this->transactionModel->DeleteTransaction($req->id);
        return response()->json($response);
    }
}

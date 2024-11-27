<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\State;

class StateController extends Controller
{
    protected $state;


    public function __construct(State $state)
    {
        $this->state = $state;
    }

        public function stateView(Request $req)
        {
            $lang = strtolower($req->input('lang', 'en'));
            $term = $req->input('term');
            $peginate=10;
    
            $data = $this->state->getState($term,$lang,$peginate);
            $country_data = $this->state->getCountry($lang); 
            return view('Admin.Location.state', compact('country_data', 'data'));
        }
        
    public function Addstate(Request $req){

        $langs = array_keys($req->input('name', []));


        $rules = [
            'country_id'=>'required',
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }
        $messages = [
            'country_id.required' => 'Choose Country',
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);

        try {
            $response = $this->state->createState($validated);
            set_flash_message('add');
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    
    }
    public function stateDetails($id = null)
    {

        $data = $this->state->getstateDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Category not found.'], 404);
        }

        return response()->json($data);
    }
    public function Editstate(Request $req)
    {

        $langs = array_keys($req->input('name', []));

        $rules = [
            'country_id'=>'required',
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        $messages = [
            'country_id.required' => 'Choose Country',
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.'
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);

        $validated['state_id'] = $req->StateId;
        try {
          
            $response = $this->state->updatestate($validated);
            set_flash_message('update');
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function stateStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->state->stateStatus($data);
        return response()->json($response);
    }

    public function stateDelete(Request $req)
    {
        $response = $this->state->Deletestate($req->id);
        set_flash_message('delete');
        return response()->json($response);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Models\Country;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CountryController extends Controller
{
    protected $country;


    public function __construct(Country $country)
    {
        $this->country = $country;
    }

    public function CountryView(Request $req){
        $lang = strtolower($req->input('lang', 'en'));
        $term = $req->input('term');
        $peginate=10;
        $data = $this->country->getCountry($term ,$lang, $peginate);
        return view('Admin.Location.country',compact('data'));
    }
    public function AddCountry(Request $req){

        $langs = array_keys($req->input('name', []));


        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);

        try {
            $response = $this->country->createCountry($validated);
            set_flash_message('add');
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    
    }
    public function CountryDetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Category ID is required.'], 400);
        }

        $data = $this->country->getCountryDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Category not found.'], 404);
        }

        return response()->json($data);
    }
    public function EditCountry(Request $req)
    {

        $langs = array_keys($req->input('name', []));

        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.'
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);

        $validated['country_id'] = $req->countryId;
        try {
          
            $response = $this->country->updateCountry($validated);
            set_flash_message('update');
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function CountryStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->country->CountryStatus($data);
        return response()->json($response);
    }

    public function CountryDelete(Request $req)
    {
        $response = $this->country->DeleteCountry($req->id);
        set_flash_message('delete');
        return response()->json($response);
    }
}

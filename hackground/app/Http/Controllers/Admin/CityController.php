<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    protected $city;


    public function __construct(City $city)
    {
        $this->city = $city;
        $this->middleware('view_permit:city');
    }

    public function CityView(Request $req)
    {
        $peginate = 10;
        $lang = strtolower($req->input('lang', 'en'));
        $term = $req->input('term');

        $data = $this->city->getCity($term, $lang, $peginate);

        $country_data = getTableData(
            'pref_country',
            ['pref_country.id', 'pref_country_names.name'],
            [
                [
                    'table' => 'pref_country_names',
                    'base_field' => 'pref_country.id',
                    'foreign_field' => 'pref_country_names.country_id',
                ],
            ],
            ['lang' => $lang],
            null
        );



        return view('Admin.Location.city', compact('country_data', 'data'));
    }

    public function AddCity(Request $req)
    {

        $langs = array_keys($req->input('name', []));


        $rules = [
            'country_id' => 'required',
            'state_id' => 'required',
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }
        $messages = [
            'country_id.required' => 'Choose Country',
            'state_id.required' => 'Choose State',
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);

        try {
            $response = $this->city->createCity($validated);
            set_flash_message('add');
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function CityDetails($id = null)
    {

        $data = $this->city->getCityDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Category not found.'], 404);
        }

        return response()->json($data);
    }
    public function EditCity(Request $req)
    {

        $langs = array_keys($req->input('name', []));

        $rules = [
            'country_id' => 'required',
            'state_id' => 'required',
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        $messages = [
            'country_id.required' => 'Choose Country',
            'state_id.required' => 'Choose State',
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);

        $validated['city_id'] = $req->cityId;
        try {

            $response = $this->city->updateCity($validated);
            set_flash_message('update');
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function CityStatus(Request $req)
    {
        $data = [
            'city_id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->city->cityStatus($data);
        return response()->json($response);
    }

    public function CityDelete(Request $req)
    {
        $response = $this->city->Deletecity($req->id);
        set_flash_message('delete');
        return response()->json($response);
    }
    public function getState(Request $req)
    {
        $lang = strtolower($req->input('lang', 'en'));
        $id = $req->input('country_id');

        $state_data = getTableData(
            'pref_state',
            ['pref_state.id', 'pref_state_names.name'],
            [
                [
                    'table' => 'pref_state_names',
                    'base_field' => 'pref_state.id',
                    'foreign_field' => 'pref_state_names.state_id',
                ],
            ],
            [
                'lang' => $lang,
                'pref_state.country' => $id
            ],
            null
        );


        $states = isset($state_data) ? $state_data : [];

        return response()->json(['states' => $states]);
    }
}

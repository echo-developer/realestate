<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LocalityModel;
use App\Traits\Imports\ExcelImportTrait;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;



class LocalityController extends Controller
{
    
    use ExcelImportTrait;
    protected $locality;

    public function __construct(LocalityModel $locality)
    {
        $this->locality = $locality;
        $this->middleware('view_permit:locality');
    }

    public function LocalityView(Request $req)
    {
        $peginate = 10;
        $lang = strtolower($req->input('lang', 'en'));
        $term = $req->input('term');

        $data = $this->locality->getLocality($term, $lang, $peginate);

        $city_data = getTableData(
            'city',
            ['city.city_id', 'city_names.name'],
            [
                [
                    'table' => 'city_names',
                    'base_field' => 'city.city_id',
                    'foreign_field' => 'city_names.city_id',
                ],
            ],
            ['lang' => $lang],
            null
        );
        // echo "<pre>";
        // print_r($data);exit;
        return view('Admin.Location.locality', compact('city_data', 'data'));
    }

    public function AddLocality(Request $req)
    {
        // return response()->json($req);
        $langs = array_keys($req->input('name', []));

        $rules = [
            'city_id' => 'required',
            'key' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }
        $messages = [
            'city_id.required' => 'Choose City',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);
        // $validated['order'] = $req->order;

        try {
            $response = $this->locality->createLocality($validated);
            set_flash_message('add');
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function LocalityDetails($id = null)
    {

        $data = $this->locality->getLocalityDetails($id);
        if ($data->isEmpty()) {
            return response()->json(['error' => 'Locality not found.'], 404);
        }

        return response()->json($data);
    }
    public function EditLocality(Request $req)
    {

        $langs = array_keys($req->input('name', []));

        $rules = [
            'city_id' => 'required',
            'key' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        $messages = [
            'city_id.required' => 'Choose City',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);

        $validated['locality_id'] = $req->localityId;
        $validated['order'] = $req->order;
        try {

            $response = $this->locality->updateLocality($validated);
            set_flash_message('update');
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function LocalityStatus(Request $req)
    {
        $data = [
            'locality_id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->locality->localityStatus($data);
        return response()->json($response);
    }

    public function LocalityDelete(Request $req)
    {
        $response = $this->locality->Deletelocality($req->id);
        set_flash_message('delete');
        return response()->json($response);
    }
    public function getState(Request $req)
    {
        $lang = strtolower($req->input('lang', 'en'));
        $id = $req->input('country_id');

        $state_data = getTableData(
            'state',
            ['state.id', 'state_names.name'],
            [
                [
                    'table' => 'state_names',
                    'base_field' => 'state.id',
                    'foreign_field' => 'state_names.state_id',
                ],
            ],
            [
                'lang' => $lang,
                'state.country' => $id
            ],
            null
        );


        $states = isset($state_data) ? $state_data : [];

        return response()->json(['states' => $states]);
    }


    // public function importExcel(Request $request)
    // {
    //     $request->validate([
    //         'xlsFileLocality' => 'required|file|mimes:xlsx,xls,csv',
    //     ]);

    //     $filePath = $request->file('xlsFileLocality')->getPathname();

    //     $spreadsheet = IOFactory::load($filePath);
    //     $sheet = $spreadsheet->getActiveSheet();
    //     $rows = $sheet->toArray();

    //     // Optionally skip headers (assume first row is header)
    //     unset($rows[0]);

    //     // log_anything($rows);
    //     $response = $this->locality->localityAddfromExcel($rows);
    //     set_flash_message('add');

    //     return redirect()->back();
    // }


    public function importLocalityExcel(Request $request)
    {
        try {
            $rows = $this->parseUploadedExcel($request, 'xlsFileLocality');

            $response = $this->locality->localityAddfromExcel($rows);

            set_flash_message('add');
            return redirect()->back();
        } catch (\Throwable $e) {
            // throw $e;
            return redirect()->back()->withErrors(['xlsFileLocality' => $e->getMessage()]);
        }
    }
}

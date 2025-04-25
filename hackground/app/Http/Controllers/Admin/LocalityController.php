<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LocalityModel;
use App\Traits\Imports\ExcelImportTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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



    public function importLocalityExcel(Request $request)
    {
        try {
            $rows = $this->parseUploadedExcelforLocality($request, 'xlsFileLocality', 9);
            $response = $this->locality->localityAddfromExcel($rows);
            set_flash_message('add');
            return redirect()->back();
        } catch (\Throwable $e) {
            return redirect()->back()->withErrors(['xlsFileLocality' => $e->getMessage()]);
        }
    }


    /*

    LOCALITY LANDMARKS BELOW
    
     */

    public function landmarkListPage(Request $request)
    {

        $localityId = $request->route('locality_id');
        $paginate = 10;

        $data = $this->locality->fetchLocalityLandmarks($localityId, [], $paginate);
        return view('Admin/Location/locality-landmarks', compact('data', 'localityId'));
    }

    public function landmarkDetails(Request $request)
    {
        $landmarkId = $request->route('id');
        $data = DB::table('locality_landmarks')->where('id', $landmarkId)->first();
        return $data;
    }

    public function landmarkStatus(Request $request)
    {
        $response = DB::table('locality_landmarks')
            ->where('id', $request->id)
            ->update(['status' => $request->status]);
        return response()->json(['message' => 'Status Updated']);
    }

    public function updateLandmark(Request $request)
    {
        $validated = $request->validate(
            [
                'name.en' => 'required|regex:/^[A-Za-z\s]+$/|max:50',
                'name.ar' => 'required|regex:/^[\p{Arabic}\s]+$/u|max:50',
                'distance' => 'required|numeric|min:0|max:5',
            ],
            [
                'name.en.required' => 'This field is required',
                'name.ar.required' => 'This field is required',
                'name.en.regex' => 'Only characters are allowed',
                'name.ar.regex' => 'Only characters are allowed',
                'name.en.max' => 'Maximum character exceeded',
                'name.ar.max' => 'Maximum character exceeded',
                'distance.required' => 'Distance is required',
                'distance.numeric' => 'Distance must be a number',
                'distance.min' => 'Distance should be greater than ZERO',
                'distance.max' => 'Maximum value is 5 KM',
            ]
        );


        $responce = DB::table('locality_landmarks')
            ->where('id', $request->landmarkId)
            ->update([
                'name_en' => $request->name['en'],
                'name_ar' => $request->name['ar'],
                'distance_km' => $request->distance,
                'status' => $request->status,
            ]);
        return response()->json(['message' => 'Landmark Updated']);
    }

    public function deleteLandmark($id = null)
    {
        if (empty($id)) {
            return response()->json(['message' => 'Something went wrong']);
        }

        DB::table('locality_landmarks')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
            ]);
        return response()->json(['message' => 'Deleted !']);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\LocalityModel;
use App\Models\LocalityAreaPrice;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class AreaPriceController extends Controller
{
    private $locality_area_price;

    public function __construct(LocalityAreaPrice $locality_area_price)
    {
        $this->middleware('view_permit:area-price');
        $this->locality_area_price = $locality_area_price;
    }
    public function AreaPrice(Request $request,LocalityModel $locality)
    {

        $projectData = $this->locality_area_price->getProjectLocationPrice();
        $propertyData = $this->locality_area_price->getProprtyLocationPrice();
        $localities = $locality->fetchLocality();
        // dd($propertyData);
        foreach ($propertyData as $item) {
            LocalityAreaPrice::updateOrInsert(
                [
                    'locality' => $item->locality,

                    'year' => $item->year,
                ],
                [
                    'price_for' => 'prop',
                    'price_per_sqft' => round($item->avg_price_per_sqft, 2),
                ]
            );
        }

        // Upsert project data
        foreach ($projectData as $item) {
            LocalityAreaPrice::updateOrInsert(
                [
                    'locality' => $item->locality,
                    'year' => $item->year,
                ],
                [
                    'price_for' => 'proj',
                    'price_per_sqft' => round($item->avg_price_per_sqft, 2),
                ]
            );
        }


        $localityIds = $request->input('locality', []);
        $year = $request->input('year');
        $avgPrice = $request->input('avg_price');

        $locality_price_prop = LocalityAreaPrice::where('price_for', 'prop')
            ->when(!empty($localityIds), function ($query) use ($localityIds) {
                $query->whereIn('locality', $localityIds);
            })
            ->when($year, function ($query) use ($year) {
                $query->where('year', $year);
            })
            ->when($avgPrice, function ($query) use ($avgPrice) {
                $query->where('price_per_sqft', '>=', $avgPrice);
            })
            ->get();

        $locality_price_proj = LocalityAreaPrice::where('price_for', 'proj')
            ->when(!empty($localityIds), function ($query) use ($localityIds) {
                $query->whereIn('locality', $localityIds);
            })
            ->when($year, function ($query) use ($year) {
                $query->where('year', $year);
            })
            ->when($avgPrice, function ($query) use ($avgPrice) {
                $query->where('price_per_sqft', '>=', $avgPrice);
            })
            ->get();

        return view('Admin.area_price', compact('locality_price_prop', 'locality_price_proj', 'localities'));
    }


    public function Edit(Request $req)
    {
        $id = $req->input('id');
        $locality_data = LocalityAreaPrice::findOrFail($id);
        $data = [
            'id' => $locality_data->id,
            'locality' => get_name_by_id('locality_names', 'locality_id', $locality_data->locality, 'en'),
            'price_per_sqft' => $locality_data->price_per_sqft,
            'new_price' => $locality_data->new_price,
        ];
        return response()->json([
            'status' => 1,
            'data' =>  $data
        ]);
    }

    public function Update(Request $req)
    {
        try {
            LocalityAreaPrice::where('id', $req->id)->update([
                'new_price' => $req->new_price
            ]);

            return response()->json([
                'status' => 1,
                'message' => 'Price updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

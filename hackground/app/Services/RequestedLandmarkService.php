<?php

namespace App\Services;

use App\Models\NearbyLandmarks;
use App\Models\RequestedLandmarkModel;
use Illuminate\Support\Facades\DB;

class RequestedLandmarkService
{

    public function addRequestedLandmarks($req)
    {
        try {
            DB::beginTransaction();
            log_anything($req->all());

            $data = json_decode($req->nearbyLocations, true);
            $dataToForward = [];
            $map = [
                'healthcare' => \App\Models\Hospital::class,
                'Healthcare' => \App\Models\Hospital::class,
                'metro'      => \App\Models\Metro::class,
                'rail'       => \App\Models\Railway::class,
                'education'  => \App\Models\Education::class,
                'bus'        => \App\Models\Bus::class,
                'others'     => \App\Models\Others::class,
            ];
            log_anything(!empty($data));
            if ($data) {
                foreach ($data as $landmark) {

                    if (!isset($map[$landmark['type']])) {
                        throw new \InvalidArgumentException("Unsupported landmark type: " . $landmark['type']);
                    }

                    $model =  $map[$landmark['type']]::query();
                    $created = $model->create([
                        'name' => $landmark['name'],
                        'status' => config('constants.STATUS_INACTIVE'),
                    ]);

                    $dataToForward[] = [
                        'uid' => auth_user_id(),
                        'property_id' => $req->property_id,
                        'loc_id' => $req->locality_id,
                        'landmark_type' => strtolower($landmark['type']),
                        'landmark_id' => $created->id,
                        'distance' =>  $landmark['distance']
                    ];
                }
                log_anything($dataToForward);
            }
            if (!empty($dataToForward)) {
                NearbyLandmarks::insert($dataToForward);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}

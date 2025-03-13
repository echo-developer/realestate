<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Controller;
use App\Models\PrefProperty;
use App\Models\PrefPropertyAdditional;
use App\Models\PrefPropertyDimension;
use App\Models\PrefPropertyGallery;
use App\Models\PrefPropertyGalleryImage;
use App\Models\PrefPropertyLocation;
use App\Models\PrefPropertySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class PostPropertyController extends Controller
{
    public function postPropertyView(Request $request)
    {
        $lang = $request->input('lang', 'en');

        //load CSS
        $cssFiles = File::files(public_path('assets/property_css'));
        $userData = Auth::guard('admin')->user();
        $cssPaths = [];
        foreach ($cssFiles as $file) {
            $cssPaths[] = 'assets/property_css/' . $file->getFilename();
        }


        $homeontroller = new HomeController();

        //load Property type
        $propertyTypes = json_decode($homeontroller->getPropertyType($request)->getContent(), true)['data'] ?? [];

        //load cities
        $cities = json_decode($homeontroller->city($request)->getContent(), true)['data'] ?? [];

        $postController = new PostController();

        //load proepertyAmenities
        $proepertyAmenities = json_decode($postController->get_property_amnity($request)->getContent(), true)['data'] ?? [];

        //load Furnishes
        $propertyFurnishes = json_decode($postController->furnish($request)->getContent(), true)['data'] ?? [];


        //load Property Status
        $propertyStatus = json_decode($postController->status($request)->getContent(), true)['data'] ?? [];
        // dd($propertyStatus);
        
        return view('Admin.Post_property_view.post_property', compact('cssPaths', 'userData', 'propertyTypes', 'cities', 'proepertyAmenities', 'propertyFurnishes', 'propertyStatus'));
    }

    public function saveProperty(Request $request)
    {
        if($request)
        {
            $step = $request->step;
            if($step == '1')
            {
                $request->validate([
                    'postAs' => 'required',
                    'name' => 'required',
                    'email' => 'required',
                ]); 

                echo json_encode(array(
                    'status'=> 'OK',
                    'nextStep'=>'2'
                ));
            }
            if($step == '2')
            {
                $request->validate([
                    'postFor' => 'required',
                    'property_type' => 'required',
                    'property_for' => 'required',
                    'property_category' => 'required',
                ]); 

                echo json_encode(array(
                    'status'=> 'OK',
                    'nextStep'=>'3'
                ));
            }
            if($step == '3')
            {
                $request->validate([
                    'city' => 'required',
                    'landmark' => 'required',
                    'address' => 'required',
                    'description' => 'required'
                ]); 

                echo json_encode(array(
                    'status'=> 'OK',
                    'nextStep'=>'4'
                ));
            }
            if($step == '4')
            {
                $request->validate([
                    'carpet_area' => 'required',
                    'super_area' => 'required',
                    'total_floors' => 'required',
                ]); 

                echo json_encode(array(
                    'status'=> 'OK',
                    'nextStep'=>'5'
                ));
            }
            if($step == '5')
            {
                $request->validate([
                    'possession_status' => 'required',
                    'expected_price' => 'required',
                    'currency' => 'required'
                ]); 

                if($request->possession_status == '1')
                {
                    $request->validate([
                        'age' => 'required',
                    ]);
                }

                if($request->possession_status == '2')
                {
                    $request->validate([
                        'construction_month' => 'required',
                        'construction_year' => 'required'
                    ]);
                }

                echo json_encode(array(
                    'status'=> 'OK',
                    'nextStep'=>'6'
                ));
            }
            if($step == '6')
            {
                log::info(json_encode($request->all()));
                
                //$property = $this->createProperty('1');
                //$this->updatePropertyDetails($property, $request);
                //$this->savePropertyLocation($property->id, $request);
                //$this->savePropertySettings($property->id, $request);
                
                //$this->savePropertyDimensions('38', $request);
                //$this->savePropertyAdditional($property->id, $request);
                $this->savePropertyGalleries('38', $request);
                exit;
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Property successfully posted',
                    'data' => [
                        'property_id' => $property->id,
                    ]
                ], 201);
                
            }

        }
    }


    public function PropertyImageStore(Request $request)
    {
        // Log::info($request->all());
        //print_r($request);exit;
        $request->validate([
            'images.*' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);

        $uploadedImages = [];
        $type = $request->input('type', 'other'); // Default to 'other' if no type is provided
        
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = time() . '_' . $file->getClientOriginalName();
                $filePath = 'user_upload/property_images/';
                $file->move(public_path($filePath), $filename);

                // Store uploaded image under the respective type
                $uploadedImages[] = [
                    'imageUrl' => asset($filePath . $filename),
                    'filename' => $filename
                ];
            }
        }
        if (empty($uploadedImages)) {
            return response()->json([
                'success' => false,
                'type' => $type,
                'images' => []
            ]);
        }

        return response()->json([
            'success' => true,
            'type' => $type, // Return the active tab key
            'images' => $uploadedImages
        ]);
    }

    private function createProperty($userId)
    {
        return PrefProperty::create([
            'uid' => $userId,
            'status' => config('constants.STATUS_INACTIVE'),
        ]);
    }

    private function updatePropertyDetails($property, $request)
    {
        $slug = get_slug_name(
            $property->id,
            '',
            $request->carpet_area,
            $request->super_area,
            $request->postFor,
            $request->landmark,
            $request->city,
            $request->property_for
        );

        $name = get_property_name(
            '',
            $request->carpet_area,
            $request->super_area,
            $request->postFor,
            $request->property_for
        );

        $property->update([
            'slug' => sanitize_slug_part($slug),
            'name' => $name,
        ]);
    }

    private function savePropertyLocation($propertyId, $request)
    {
        PrefPropertyLocation::create([
            'pid' => $propertyId,
            'city' => $request->city,
            'locality' => $request->landmark,
            'property_address' => $request->address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);
    }

    private function savePropertySettings($propertyId, $request)
    {
        PrefPropertySetting::create([
            'pid' => $propertyId,
            'parking_ability' => $request->parking_ability,
            'property_type' => $request->property_type, //arsad changed this , key was wrong ,'property_for'=> 'property_type' 
            'property_type_for' => $request->property_for,
            'carpet_area' => $request->carpet_area,
            'super_area' => $request->super_area,
            'rooms' => 4,
            'expected_price' => $request->expected_price,
            'post_for' => $request->postFor,
            'price_currency' => $request->currency,
            'property_budget' => $request->property_budget,
        ]);
    }

    private function savePropertyDimensions($propertyId, $request)
    {
        $bedroom = $request->bedroom;
        $bathroom = $request->bathroom;
        $balcony = $request->balcony;
       
        $dimension_arr = array();
        $structure = array();
        if($bedroom)
        {
            if($bedroom['width'])
            {
                foreach($bedroom['width'] as $k=>$w)
                {
                    $structure['pid'] = $propertyId;
                    $structure['room_type'] = 'bedroom';
                    $structure['size'] = json_encode(array(
                        'height'=> $bedroom['height'][$k],
                        'width'=> $w,
                    ));
                    $dimension_arr[] = $structure;
                }
            }
        }
        if($bathroom)
        {
            if($bathroom['width'])
            {
                foreach($bathroom['width'] as $k=>$w)
                {
                    $structure['pid'] = $propertyId;
                    $structure['room_type'] = 'bathroom';
                    $structure['size'] = json_encode(array(
                        'height'=> $bathroom['height'][$k],
                        'width'=> $w,
                    ));
                    $dimension_arr[] = $structure;
                }
            }
        }
        if($balcony)
        {
            if($balcony['width'])
            {
                foreach($balcony['width'] as $k=>$w)
                {
                    $structure['pid'] = $propertyId;
                    $structure['room_type'] = 'balcony';
                    $structure['size'] = json_encode(array(
                        'height'=> $balcony['height'][$k],
                        'width'=> $w,
                    ));
                    $dimension_arr[] = $structure;
                }
            }
        }
        PrefPropertyDimension::insert($dimension_arr);
    }

    private function savePropertyAdditional($propertyId, $request)
    {
        $expected_possesion_month_year = trim(
            ($request->construction_month ?? '') .
                ((!empty($request->construction_month) && !empty($request->construction_year)) ? '-' : '') .
                ($request->construction_year ?? '')
        );

        PrefPropertyAdditional::create([
            'pid' => $propertyId,
            'floor' => $request->floors,
            'total_floor' => $request->total_floors,
            'corner_plot' => $request->corner_plot,
            'construct_year' => $request->age,
            'possession_status' => $request->possession_status,
            'property_furnish' => $request->property_furnish,
            'property_amenity' => is_array($request->amenities) ? implode(',', $request->amenities) : $request->property_amenity,
            'total_floor' => $request->total_floors,
            'is_personal_washroom' => $request->personal_washroom,
            'pantry_cafeteria_status' => $request->cafeteria,
            'is_corner_shop' => $request->corner_shop,
            'faces_main_road' => $request->main_road_facing,
            'property_desc' => $request->description,
            'expected_possesion_month_year' => $expected_possesion_month_year
        ]);
    }

    private function savePropertyGalleries($propertyId, $request)
    {
        $galleries = $request->image;
        $description = $request->image_desc;
        
        if($description)
        {
            foreach($description as $k=>$d)
            {
                $gallery = PrefPropertyGallery::create([
                    'pid' => $propertyId,
                    'image_type' => $k,
                    'description' => $d
                ]);

                if(array_key_exists($k,$galleries))
                {
                    foreach($galleries[$k] as $image) {
                        PrefPropertyGalleryImage::create([
                            'gallary_id' => $gallery->id,
                            'filename' => $image,
                        ]);
                    }
                }
                
            }
        }
        
    }

}

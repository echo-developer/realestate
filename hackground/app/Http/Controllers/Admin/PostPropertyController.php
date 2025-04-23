<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PrefProperty;
use App\Models\PrefPropertyAdditional;
use App\Models\PrefPropertyDimension;
use App\Models\PrefPropertyGallery;
use App\Models\PrefPropertyGalleryImage;
use App\Models\PrefPropertyLocation;
use App\Models\PrefPropertySetting;
use App\Models\PrefPropertyLandmark;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class PostPropertyController extends Controller
{
    public function postPropertyView(Request $request)
    {
        $user_id = $request->uid;
        if ($user_id) {
            $lang = $request->input('lang', 'en');

            //load CSS
            $cssFiles = File::files(public_path('assets/property_css'));
            $userData = User::where('id', $user_id)->first();
            
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
        } else {
            return redirect('member/memberUser');
        }
    }
    public function EditProperty(Request $request)
    {

        $lang = $request->input('lang', 'en');
        $property_id = $request->route('propId');

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

        $propertyData = PrefProperty::where('id',  $property_id)->with([
            'settings',
            'additional',
            'location',
            'dimensions',
            'landmarks',
            'gallery',
            'gallery.images'
        ])->first();
        // dd($propertyData);

        // Define categories
        $landmark_categories = [
            'education' => [],
            'healthcare' => [],
            'shopping' => [],
            'commercial' => [],
            'transportation' => []
        ];

        // Categorize landmarks
        foreach ($propertyData->landmarks as $landmark) {
            // Decode landmark details from JSON
            $details = json_decode($landmark->landmark_details, true);

            // Determine category based on landmark_type
            if (strpos($landmark->landmark_type, 'education') !== false) {
                $landmark_categories['education'][] = $details;
            } elseif (strpos($landmark->landmark_type, 'healthcare') !== false) {
                $landmark_categories['healthcare'][] = $details;
            } elseif (strpos($landmark->landmark_type, 'shopping_center') !== false) {
                $landmark_categories['shopping'][] = $details;
            } elseif (strpos($landmark->landmark_type, 'commercial') !== false) {
                $landmark_categories['commercial'][] = $details;
            } elseif (strpos($landmark->landmark_type, 'transportation') !== false) {
                $landmark_categories['transportation'][] = $details;
            }
        }

        $groupedImages = [];
        if ($propertyData->gallery) {
            foreach ($propertyData->gallery as $gallery) {
                $groupedImages[$gallery->image_type] = $gallery->images;
            }
        }
        // echo "<pre>";
        // print_r($propertyData);exit;
        return view('Admin.Post_property_view.edit_property', compact('propertyTypes', 'property_id', 'cities', 'proepertyAmenities', 'propertyFurnishes', 'propertyStatus', 'propertyData', 'groupedImages', 'landmark_categories'));
    }

    public function load_ajax_page(Request $request)
    {
        $srch = $request->query();
        $page = $srch['page'];
        $ID = "";
        $detail = "";
        $city = get_all_city();
        $property_category = get_all_property_category();
        $homeontroller = new HomeController();
        $postController = new PostController();
        $propertyTypes = json_decode($homeontroller->getPropertyType($request)->getContent(), true)['data'] ?? [];
        $cities = json_decode($homeontroller->city($request)->getContent(), true)['data'] ?? [];
        $proepertyAmenities = json_decode($postController->get_property_amnity($request)->getContent(), true)['data'] ?? [];
        $propertyFurnishes = json_decode($postController->furnish($request)->getContent(), true)['data'] ?? [];
        $propertyStatus = json_decode($postController->status($request)->getContent(), true)['data'] ?? [];
        $title = '';
        if($page == 'basic')
        {
            $title = 'Edit Basic Details';
            $property_id = $srch['id'];
			$form_action = url('property/save-edit-property/basic');
        }
        if($page == 'location')
        {
            $title = 'Edit Location Details';
            $property_id = $srch['id'];
			$form_action = url('property/save-edit-property/location');
        }
        if($page == 'features')
        {
            $title = 'Edit Property Features';
            $property_id = $srch['id'];
			$form_action = url('property/save-edit-property/features');
        }
        if($page == 'additional')
        {
            $title = 'Edit Additional Details';
            $property_id = $srch['id'];
			$form_action = url('property/save-edit-property/additional');
        }
        if($page == 'landmark')
        {
            $title = 'Edit Landmark Details';
            $property_id = $srch['id'];
			$form_action = url('property/save-edit-property/landmark');
        }
        $propertyData = PrefProperty::where('id',  $property_id)->with([
            'settings',
            'additional',
            'location',
            'dimensions',
            'landmarks',
            'gallery',
            'gallery.images'
        ])->first();
       
        return view('Admin.Post_property_view.ajax_page', compact(
                                                            'page', 
                                                            'title', 
                                                            'form_action', 
                                                            'ID', 
                                                            'propertyData', 
                                                            'propertyTypes', 
                                                            'property_id',
                                                            'cities',
                                                            'proepertyAmenities',
                                                            'propertyFurnishes',
                                                            'propertyStatus'
                                                        ));
    }

    public function saveProperty(Request $request)
    {
        if ($request) {
            $step = $request->step;
            $user_id = $request->user_id;
            $prop_id = $request->prop_id;

            if ($step == '2') {
                $request->validate([
                    'postAs' => 'required',
                    'postFor' => 'required',
                    'property_type' => 'required',
                    'property_for' => 'required',
                    'property_category' => 'required',
                ]);

                return json_encode(array(
                    'status' => 'OK',
                    'nextStep' => '3'
                ));
            }
            if ($step == '3') {
                $request->validate([
                    'city' => 'required',
                    //'landmark' => 'required',
                    'address' => 'required',
                    'description' => 'required'
                ]);

                return json_encode(array(
                    'status' => 'OK',
                    'nextStep' => '4'
                ));
            }
            if ($step == '4') {
                return json_encode(array(
                    'status' => 'OK',
                    'nextStep' => '5'
                ));
            }
            if ($step == '5') {
                $request->validate([
                    'carpet_area' => 'required',
                    'super_area' => 'required',
                    'total_floors' => 'required',
                ]);

                return json_encode(array(
                    'status' => 'OK',
                    'nextStep' => '6'
                ));
            }
            if ($step == '6') {
                $request->validate([
                    'possession_status' => 'required',
                    'expected_price' => 'required',
                    'currency' => 'required'
                ]);

                if ($request->possession_status == '1') {
                    $request->validate([
                        'age' => 'required',
                    ]);
                }

                if ($request->possession_status == '2') {
                    $request->validate([
                        'construction_month' => 'required',
                        'construction_year' => 'required'
                    ]);
                }

                return json_encode(array(
                    'status' => 'OK',
                    'nextStep' => '7'
                ));
            }
            if ($step == '7') {
                try {
                    DB::beginTransaction();
                    log::info(json_encode($request->all()));

                    // Check if prop_id exists to determine update or create
                    if ($prop_id) {
                        $property = PrefProperty::findOrFail($prop_id);
                        // Update existing property
                        $this->updatePropertyDetails($property, $request);
                    } else {
                        // Create new property
                        $property = $this->createProperty($user_id);
                        $this->updatePropertyDetails($property, $request);
                    }

                    // Save related data (update if exists, create if not)
                    $this->savePropertyLocation($property->id, $request);
                    $this->savePropertySettings($property->id, $request);
                    $this->savePropertyDimensions($property->id, $request);
                    $this->savePropertyAdditional($property->id, $request);
                    $this->savePropertyGalleries($property->id, $request);
                    $this->savePropertyLandmark($property->id, $request);

                    DB::commit();

                    return response()->json([
                        'status' => 'SUCCESS',
                        'message' => $prop_id ? 'Property successfully updated' : 'Property successfully posted',
                        'property_id' => $property->id,
                        'redirect' => url('allproperties/all-property-view/' . $user_id)
                    ], 201);
                } catch (\Exception $e) {
                    DB::rollback();
                    return response()->json([
                        'status' => 'ERROR',
                        'message' => 'Failed to save property: ' . $e->getMessage()
                    ], 500);
                }
            }
        }
        return response()->json([
            'status' => 'ERROR',
            'message' => 'Invalid request'
        ], 400);
    }

    public function saveEditProperty(Request $request)
    {
        if ($request) {

            $type = $request->route('type');
            $prop_id = $request->property_id;
            
            if ($type == 'basic') {
                $request->validate([
                    'postFor' => 'required',
                    'property_type' => 'required',
                    'property_for' => 'required',
                    'expected_price' => 'required',
                ]);
                
                $settings_data = array(
                    'post_for' => $request->postFor,
                    'property_type' => $request->property_type,
                    'property_type_for' => $request->property_for,
                    'price_currency' => $request->currency,
                    'expected_price' => $request->expected_price,
                    'project_name' => $request->project_name
                );

                $additional_data = array(
                    'buyer_message' => $request->buyer_message,
                );

                PrefPropertySetting::where('pid', $prop_id)->update($settings_data);
                PrefPropertyAdditional::where('pid', $prop_id)->update($additional_data);
                
                return json_encode(array(
                    'status' => 'OK',
                ));
            }
            if ($type == 'location') {
                $request->validate([
                    'city' => 'required',
                    'landmark' => 'required',
                    'address' => 'required',
                    //'description' => 'required'
                ]);
                $this->savePropertyLocation($prop_id, $request);
                return json_encode(array(
                    'status' => 'OK',
                ));
            }
            if ($type == 'features') {
                $request->validate([
                    'carpet_area' => 'required',
                    'super_area' => 'required',
                    'total_floors' => 'required',
                ]);
            
                $settings_data = array(
                    'carpet_area' => $request->carpet_area,
                    'super_area' => $request->super_area,
                    'bedrooms' => $request->bedroom_count ?? null,
                    'bathrooms' => $request->bathroom_count ?? null,
                );

                $additional_data = array(
                    'floor' => $request->floors,
                    'total_floor' => $request->total_floors,
                    'flooring_style' => is_array($request->flooring_style) ? implode(',', $request->flooring_style) : $request->flooring_style,
                    'facing_direction' => $request->facing_direction,
                    'corner_plot' => $request->corner_plot,
                    'allowed_construction' => $request->allowed_construction,
                    'construct_year' => $request->age,
                    'flat_each_floor' => $request->flat_each_floor,
                    'lifts_in_tower' => $request->lifts_in_tower,
                    'property_furnish' => $request->property_furnish,
                    'property_amenity' => is_array($request->amenities) ? implode(',', $request->amenities) : $request->property_amenity,
                    'balcony' => $request->balcony_count ?? null,
                );

                PrefPropertySetting::where('pid', $prop_id)->update($settings_data);
                PrefPropertyAdditional::where('pid', $prop_id)->update($additional_data);
                $this->savePropertyDimensions($prop_id, $request);

                return json_encode(array(
                    'status' => 'OK',
                ));
            }
            if ($type == 'additional') {
                $request->validate([
                    'possession_status' => 'required',
                ]);

                if ($request->possession_status == '1') {
                    $request->validate([
                        'age' => 'required',
                    ]);
                }

                if ($request->possession_status == '2') {
                    $request->validate([
                        'construction_month' => 'required',
                        'construction_year' => 'required'
                    ]);
                }

                $expected_possesion_month_year = trim(
                    ($request->construction_month ?? '') .
                        ((!empty($request->construction_month) && !empty($request->construction_year)) ? '-' : '') .
                        ($request->construction_year ?? '')
                );
                
                $additional_data = array(
                    'possession_status' => $request->possession_status,
                    'expected_possesion_month_year' => $expected_possesion_month_year,
                    'facing_direction' => $request->facing_direction,
                    'overlooking' => $request->overlooking,
                    'electric_available' => $request->electric_available,
                    'water_available' => $request->water_available,
                    'ownership_type' => $request->ownership_type,
                );

                $settings_data = array(
                    'parking_ability' => $request->parking,
                );

                PrefPropertySetting::where('pid', $prop_id)->update($settings_data);
                PrefPropertyAdditional::where('pid', $prop_id)->update($additional_data);
                return json_encode(array(
                    'status' => 'OK',
                ));
            }
            if ($type == 'landmark') {
                if ($prop_id) {
                    $property = PrefProperty::findOrFail($prop_id);
                    $this->savePropertyLandmark($property->id, $request);
                } 
    
                return response()->json([
                    'status' => 'OK',
                    'message' => 'Landmark successfully updated',
                ], 200);
            }
        }
        return response()->json([
            'status' => 'ERROR',
            'message' => 'Invalid request'
        ], 400);
    }

    private function savePropertyLandmark($propertyId, $request)
    {
        $data = array();
        $education = $request->education ? $request->education : array();
        $healthcare = $request->healthcare ? $request->healthcare : array();
        $shopping = $request->shopping ? $request->shopping : array();
        $commercial = $request->commercial ? $request->commercial : array();
        $transportation = $request->transportation ? $request->transportation : array();

        if($education)
        {
            foreach($education['name'] as $k=>$v)
            {
                if($v)
                {
                    $data[] = array(
                        'property_id'=>$propertyId,
                        'landmark_type'=> 'education',
                        'landmark_type_count'=>$k+1,
                        'landmark_details'=>json_encode(array(
                            'name'=> $v,
                            'distance'=> $education['distance'][$k]
                        ))
                    );
                }
            }
        }

        if($healthcare)
        {
            foreach($healthcare['name'] as $k=>$v)
            {
                if($v)
                {
                    $data[] = array(
                        'property_id'=>$propertyId,
                        'landmark_type'=> 'healthcare',
                        'landmark_type_count'=>$k+1,
                        'landmark_details'=>json_encode(array(
                            'name'=> $v,
                            'distance'=> $healthcare['distance'][$k]
                        ))
                    );
                }
            }
        }

        if($shopping)
        {
            foreach($shopping['name'] as $k=>$v)
            {
                if($v)
                {
                    $data[] = array(
                        'property_id'=>$propertyId,
                        'landmark_type'=> 'shopping_center',
                        'landmark_type_count'=>$k+1,
                        'landmark_details'=>json_encode(array(
                            'name'=> $v,
                            'distance'=> $shopping['distance'][$k]
                        ))
                    );
                }
            }
        }

        if($commercial)
        {
            foreach($commercial['name'] as $k=>$v)
            {
                if($v)
                {
                    $data[] = array(
                        'property_id'=>$propertyId,
                        'landmark_type'=> 'commercial',
                        'landmark_type_count'=>$k+1,
                        'landmark_details'=>json_encode(array(
                            'name'=> $v,
                            'distance'=> $commercial['distance'][$k]
                        ))
                    );
                }
            }
        }

        if($transportation)
        {
            foreach($transportation['name'] as $k=>$v)
            {
                if($v)
                {
                    $data[] = array(
                        'property_id'=>$propertyId,
                        'landmark_type'=> 'transpotation',
                        'landmark_type_count'=>$k+1,
                        'landmark_details'=>json_encode(array(
                            'name'=> $v,
                            'distance'=> $transportation['distance'][$k]
                        ))
                    );
                }
            }
        }
        
        DB::table('property_landmarks as l')->where('l.property_id',$propertyId)->delete();
        if($data) {
            DB::table('property_landmarks')->insert($data);
        }
    }

    public function EditPropertyPhotos(Request $request)
    {
        $lang = $request->input('lang', 'en');
        $property_id = $request->route('propId');
        $form_action = url('property/save-property-photos/'.$property_id);
        $postController = new PostController();

        $images = DB::table('property_gallary as g')
                       ->leftJoin('property_gallary_images as i', 'g.id', '=', 'i.gallary_id')
                       ->select('g.id','g.image_type','g.description','i.filename','i.caption')
                       ->where('g.pid',$property_id)
                       ->get();
        return view('Admin.Post_property_view.edit_photos', compact('property_id', 'images', 'form_action'));
    }

    public function saveEditPropertyPhotos(Request $request)
    {
        if ($request) {
            $property_id = $request->route('property_id');
            $this->savePropertyGalleries($property_id, $request);
            
            return response()->json([
                'status' => 'OK',
                'message' => 'Gallery updated successfully'
            ], 200);
        }
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

        return $property;
    }

    private function savePropertyLocation($propertyId, $request)
    {
        $location = PrefPropertyLocation::where('pid', $propertyId)->first();
        $data = [
            'pid' => $propertyId,
            'city' => $request->city,
            'locality' => $request->locality,
            'property_address' => $request->address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ];

        if ($location) {
            $location->update($data);
        } else {
            PrefPropertyLocation::create($data);
        }
    }

    private function savePropertySettings($propertyId, $request)
    {
        $settings = PrefPropertySetting::where('pid', $propertyId)->first();
        $data = [
            'pid' => $propertyId,
            'parking_ability' => $request->parking,
            'property_type' => $request->property_type,
            'property_type_for' => $request->property_for,
            'carpet_area' => $request->carpet_area,
            'super_area' => $request->super_area,
            'rooms' => 4,
            'bedrooms' => $request->bedroom_count ?? null,
            'bathrooms' => $request->bathroom_count ?? null,
            'expected_price' => $request->expected_price,
            'post_for' => $request->postFor,
            'price_currency' => $request->currency,
            'property_budget' => $request->property_budget,
            'project_name' => $request->project_name
        ];

        if ($settings) {
            $settings->update($data);
        } else {
            PrefPropertySetting::create($data);
        }
    }

    private function savePropertyAdditional($propertyId, $request)
    {
        $additional = PrefPropertyAdditional::where('pid', $propertyId)->first();
        $expected_possesion_month_year = trim(
            ($request->construction_month ?? '') .
                ((!empty($request->construction_month) && !empty($request->construction_year)) ? '-' : '') .
                ($request->construction_year ?? '')
        );
        //print_r($request->all());exit;
        $data = [
            'pid' => $propertyId,
            'floor' => $request->floors,
            'total_floor' => $request->total_floors,
            'flooring_style' => is_array($request->flooring_style) ? implode(',', $request->flooring_style) : $request->flooring_style,
            'facing_direction' => $request->facing_direction,
            'corner_plot' => $request->corner_plot,
            'allowed_construction' => $request->allowed_construction,
            'construct_year' => $request->age,
            'flat_each_floor' => $request->flat_each_floor,
            'lifts_in_tower' => $request->lifts_in_tower,
            'possession_status' => $request->possession_status,
            'property_furnish' => $request->property_furnish,
            'property_amenity' => is_array($request->amenities) ? implode(',', $request->amenities) : $request->amenities,
            'overlooking' => is_array($request->overlooking) ? implode(',', $request->overlooking) : $request->overlooking,
            'is_personal_washroom' => $request->personal_washroom,
            'pantry_cafeteria_status' => $request->cafeteria,
            'is_corner_shop' => $request->corner_shop,
            'faces_main_road' => $request->main_road_facing,
            'property_desc' => $request->description,
            'balcony' => $request->balcony_count ?? null,
            'buyer_message' => $request->buyer_message ?? null,
            'expected_possesion_month_year' => $expected_possesion_month_year,
            'electric_available' => $request->electric_available,
            'water_available' => $request->water_available,
            'ownership_type' => $request->ownership_type,
            'token_amount' => $request->token_amount,
        ];
        //print_r($data);exit;
        if ($additional) {
            $additional->update($data);
        } else {
            PrefPropertyAdditional::create($data);
        }
    }

    private function savePropertyDimensions($propertyId, $request)
    {
        // First delete existing dimensions
        PrefPropertyDimension::where('pid', $propertyId)->delete();

        // Then create new ones
        $dimension_arr = array();
        $structure = array();
        
        foreach (['bedroom', 'bathroom', 'balcony'] as $room_type) {
            if ($request->$room_type && $request->$room_type['width']) {
                foreach ($request->$room_type['width'] as $k => $w) {
                    $structure['pid'] = $propertyId;
                    $structure['room_type'] = $room_type;
                    $structure['size'] = json_encode(array(
                        'height' => $request->$room_type['height'][$k],
                        'width' => $w,
                    ));
                    $dimension_arr[] = $structure;
                }
                
            }
        }
        
        if (!empty($dimension_arr)) {
            PrefPropertyDimension::insert($dimension_arr);
        }
    }

    private function savePropertyGalleries($propertyId, $request)
    {
        $galleries = $request->image;
        $description = $request->image_desc;
        
        $prevGallary = DB::table('property_gallary as g')->select('g.*')->where('g.pid',$propertyId)->get();
        
        if($prevGallary)
        {
            $gallary_id = [];
            foreach($prevGallary as $k=>$g)
            {
                $gallary_id[] = $g->id;
            }
            if($gallary_id)
            {
                DB::table('property_gallary_images as i')->whereIn('i.gallary_id',$gallary_id)->delete();
                DB::table('property_gallary as g')->where('g.pid',$propertyId)->delete();
            }
            
        }
        
        if ($description) {
            foreach ($description as $k => $d) {
                $gallery = PrefPropertyGallery::create([
                    'pid' => $propertyId,
                    'image_type' => $k,
                    'description' => $d
                ]);

                if (array_key_exists($k, $galleries)) {
                    foreach ($galleries[$k] as $image) {
                        PrefPropertyGalleryImage::create([
                            'gallary_id' => $gallery->id,
                            'filename' => $image,
                        ]);
                    }
                }
            }
        }
    }

    private function countRooms($rooms)
    {
        // Check if the input is already an array
        if (is_array($rooms)) {
            return count($rooms);
        }

        // If not, attempt to decode the JSON string
        $decodedRooms = json_decode($rooms, true);

        // If decoding is successful and the result is an array, count the rooms
        return is_array($decodedRooms) ? count($decodedRooms) : 0;
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
}

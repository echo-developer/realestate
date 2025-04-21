<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Api\ApiModel;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AdvertisementController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }

    public function getAdvertisements(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page' => 'required|string',
            'position' => 'required|string',
        ]);

        if($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }
    
        $ads = $this->apiModel->getPageAdvertisements($request->all());
       
        if($ads)
        {
            foreach($ads as $k=>$ad)
            {
                if($ad->ad_image)
                {
                    $ads[$k]->ad_image = asset('user_upload/advertisement/'.$ad->ad_image);
                }
                if($ad->ad_image_mobile)
                {
                    $ads[$k]->ad_image_mobile = asset('user_upload/advertisement/'.$ad->ad_image_mobile);
                }
                $ad_id = $ad->advertisement_id;
                $this->apiModel->addAdImpressions($ad_id);
            }

            return response()->json([
                    'status' => 1,
                    'message' => 'Advertisements fetched successfully.',
                    'data' => $ads,
                ], 200);  
        }else{
            return response()->json([
                'status' => 0,
                'message' => 'No advertisement found.',
                'data' => $ads,
            ], 200);
        }
       
    }

    public function add_view(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'advertisement_id' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }
        
        $up = $this->apiModel->addAdvertisementView($request->all());
        if($up)
        {
            return response()->json([
                    'status' => 1,
                    'message' => 'One view added .',
                ], 200);  
        }else{
            return response()->json([
                'status' => 0,
                'message' => 'Failed to add view.',
            ], 200);
        }
       
    }

    public function saveAdvertisementRequest(Request $request)
    {
        $step = $request->step;
        
        $validator = Validator::make($request->all(), [
            'advertiser_name' => 'required',
            'email'=> 'required',
            'phone_code'=>'required|integer',
            'phone'=>'required|integer',
            'city_id'=>'required|integer',
            'locality_id'=>'required|integer',
            'page'=>'required',
            'position'=>'required',
            'duration'=>'required',
            'email_otp'=>'required|integer',
        ]);
        if($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $email = $request->email;
        $otp=rand(111111,999999);
        $token=md5($email.'_'.$otp);
        $token_type='OTP_EMAIL';
        $token_data = array(
            'tokenable_type'=> $token_type,
            'token'=>$token,
            'last_used_at'=> date('Y-m-d H:i:s')
        );
        DB::table('personal_access_token')->where('token',$token)->delete();
        $up = $this->apiModel->addAdvertisementRequest($request->all());
        if($up)
        {
            return response()->json([
                    'status' => 1,
                    'message' => 'Request sent successfully.',
                ], 200);  
        }else{
            return response()->json([
                'status' => 0,
                'message' => 'Failed to send request.',
            ], 200);
        }
       
    }

}

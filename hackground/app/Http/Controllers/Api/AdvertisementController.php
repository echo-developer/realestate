<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Api\ApiModel;
use App\Models\EmailVerifyOtpModel;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

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
    
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email'=> 'required',
            'phone_code'=>'required|integer',
            'phone'=>'required|integer',
            'city_id'=>'required|integer',
            'locality_id'=>'required|integer',
            'page'=>'required',
            'position'=>'required',
            'duration'=>'required',
            'otp'=>'required|integer'
        ]);
        if($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $otpRecord = EmailVerifyOtpModel::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('expires_at', '>', Carbon::now())
            ->first();
        //print_r($otpRecord);exit;
        if($otpRecord)
        {
            $user_id = auth_user_id();
            $email = $request->email;
            $email_exists = DB::table('users as u')->where('u.email',$email)->first();
            if($email_exists)
            {
                $user_id = $email_exists->id;
            }else{
                $user = User::create([
                    'name' => $request->name,
                    'user_type' => $request->user_type,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'phone' => $request->phone,
                    'phone_code' => $request->phone_code
                ]);
                $user_id = $user->id;
                $token = JWTAuth::fromUser($user);
            }
            $post_data = $request->all();
            $post_data['user_id'] = $user_id;
            $up = $this->apiModel->addAdvertisementRequest($post_data);
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
        }else{
            return response()->json([
                'status' => 0,
                'message' => 'Invalid OTP entered.',
            ], 200);
        }
       
    }

}

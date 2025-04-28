<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Api\ApiModel;
use App\Models\EmailVerifyOtpModel;
use App\Models\User;
use App\Models\Advertisement;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdvertisementController extends Controller
{
    protected $apiModel;
    protected $advertisement;
    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
        $advertisement = new Advertisement;
        $this->advertisement = $advertisement;
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
            'has_banner'=>'required',
        ]);
        $user_id = '';
        $user_id = auth_user_id();
        $is_login = 0;
        if($user_id)
        {
            $is_login = 1;
        }

        if(!$is_login){
            $validator = Validator::make($request->all(), [
                'otp'=>'required|integer'
            ]);
        }

        if($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }
        $is_valid = 0;
        if($is_login)
        {
            $is_valid = 1;
        }else{
            $email = $request->email;
            $email_exists = DB::table('users as u')->where('u.email',$email)->first();
            if($email_exists)
            {
                $is_valid = 1;
                $user_id = $email_exists->id;
            }else{
                $otpRecord = EmailVerifyOtpModel::where('email', $request->email)
                                    ->where('otp', $request->otp)
                                    ->where('expires_at', '>', Carbon::now())
                                    ->where('status','!=','1')
                                    ->first();
                if($otpRecord)
                {
                    $is_valid = 1;
                    $password = $this->generatePassword('6');
                    $user = User::create([
                        'name' => $request->name,
                        'user_type' => $request->user_type,
                        'email' => $request->email,
                        'password' => Hash::make('123456'),
                        'phone' => $request->phone,
                        'phone_code' => $request->phone_code
                    ]);
                    $user_id = $user->id;
                    $template = 'user-password';
                    $data_parse=array(
                        'USERNAME'=> $request->name,
                        'PASSWORD'=> $password
                    );
                    SendMail($request->email, $template, $data_parse);
                }else{
                    return response()->json([
                        'status' => 0,
                        'message' => 'Invalid OTP entered.',
                    ], 200);
                }
            }
        }

        if($is_valid)
        {
            $post_data = $request->all();
            $post_data['user_id'] = $user_id;
            $up = $this->apiModel->addAdvertisementRequest($post_data);
            if($up)
            {
                $otpRecord = EmailVerifyOtpModel::where('email', $request->email)->update(['status'=>1]);
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
                'message' => 'Something went wrong.',
            ], 200);
        }
        
        // if($otpRecord)
        // {
        //     $user_id = "";
        //     $email = $request->email;
        //     $email_exists = DB::table('users as u')->where('u.email',$email)->first();
        //     if($email_exists)
        //     {
        //         $user_id = $email_exists->id;
        //     }else{
        //         $password = $this->generatePassword('6');
        //         $user = User::create([
        //             'name' => $request->name,
        //             'user_type' => $request->user_type,
        //             'email' => $request->email,
        //             'password' => Hash::make('123456'),
        //             'phone' => $request->phone,
        //             'phone_code' => $request->phone_code
        //         ]);
        //         $user_id = $user->id;
        //         $template = 'user-password';
        //         $data_parse=array(
        //             'USERNAME'=> $request->name,
        //             'PASSWORD'=> $password
        //         );
        //         SendMail($request->email, $template, $data_parse);
        //         $token = JWTAuth::fromUser($user);
        //     }
        //     $post_data = $request->all();
        //     $post_data['user_id'] = $user_id;
        //     $up = $this->apiModel->addAdvertisementRequest($post_data);
        //     if($up)
        //     {
        //         $otpRecord = EmailVerifyOtpModel::where('email', $request->email)->update(['status'=>1]);
        //         return response()->json([
        //                 'status' => 1,
        //                 'message' => 'Request sent successfully.',
        //             ], 200);  
        //     }else{
        //         return response()->json([
        //             'status' => 0,
        //             'message' => 'Failed to send request.',
        //         ], 200);
        //     }
        // }else{
        //     return response()->json([
        //         'status' => 0,
        //         'message' => 'Invalid OTP entered.',
        //     ], 200);
        // }
       
    }

    public function generatePassword($length) {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $password = '';
        for ($i = 0; $i < $length; $i++) {
            $password .= $chars[rand(0, strlen($chars) - 1)];
        }
        return $password;
    }

    public function get_ads_pages()
    {
        $pages = $this->advertisement->get_pages();
        return response()->json([
            'status' => 1,
            'message' => 'Data retrieved successfully.',
            'data' => $pages,
        ], 200);
    }

    public function get_ads_position($page)
    {
        $position = $this->advertisement->get_position($page);
        return response()->json([
            'status' => 1,
            'message' => 'Data retrieved successfully.',
            'data' => $position,
        ], 200);
    }

    public function userAdvertisementRequests(Request $request)
    {
        $recentPage = $request->input('current_page', 1);
        $limit = $request->input('limit', 10);
        $offset = ($recentPage - 1) * $limit;

        $user_id = $request->user_id;
        $list = $this->apiModel->getUserAdvertisementRequests($user_id, $limit, $offset);
        $total_count = $this->apiModel->getUserAdvertisementRequests($user_id, '', '', FALSE);
        $customArr = [];
        if($list)
        {
            foreach($list as $k=>$l)
            {
                $status = '';
                if($l->status == '1'){$status = 'Completed';}
                elseif($l->status == '0'){$status = 'Pending';}
                elseif($l->status == '2'){$status == 'Rejected';}
                $customArr[] = array(
                    'id'=> $l->request_id,
                    'name'=> $l->name,
                    'email'=> $l->email,
                    'phone_code'=> $l->phone_code,
                    'phone'=> $l->phone,
                    'city'=> $l->city_id ? get_name_by_id("city_names", "city_id", $l->city_id, "en") : '',
                    'locality'=> $l->locality_id ? get_name_by_id("locality_names", "locality_id", $l->locality_id, "en") : '',
                    'page'=> $l->page,
                    'position'=> $l->position,
                    'duration'=> $l->duration ? $l->duration.' Weeks' : '',
                    'status'=> $status,
                    'created_date'=>date('d-M-Y', strtotime($l->created_at))
                );
            }
            
            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => $customArr,
                'pagination' => [
                            'current_page' => $recentPage,
                            'per_page' => $limit,
                            'total_pages' => ceil($total_count / $limit),
                        ],
            ], 200);  
        }else{
            return response()->json([
                'status' => 0,
                'message' => 'Failed to retrieve data.',
                'data' => [],
            ], 200); 
        }
    }

    public function userAdvertisementsList(Request $request)
    {
        $recentPage = $request->input('current_page', 1);
        $limit = $request->input('limit', 10);
        $offset = ($recentPage - 1) * $limit;

        $user_id = $request->user_id;
        $list = $this->apiModel->getUserAdvertisementsList($user_id, $limit, $offset);
        $total_count = $this->apiModel->getUserAdvertisementsList($user_id, '', '', FALSE);
        $customArr = [];
        if($list)
        {
            foreach($list as $k=>$l)
            {
                $status = '';
                if($l->status == '1'){$status = 'Completed';}
                elseif($l->status == '0'){$status = 'Pending';}
                elseif($l->status == '2'){$status == 'Rejected';}
                $customArr[] = array(
                    'id'=> $l->advertisement_id,
                    'ad_image'=>!empty($l->ad_image)? asset('/user_upload/advertisement/'.$l->ad_image):'',
                    'ad_type'=> $l->ad_type,
                    'views'=> $l->views,
                    'impressions'=> $l->impressions,
                    'page'=> $l->page,
                    'position'=> $l->position,
                    'start_date'=> date('d-M-Y',strtotime($l->start_date)),
                    'expire_date'=> date('d-M-Y',strtotime($l->expire_date)),
                    'locality'=> $l->location_id ? get_name_by_id("locality_names", "locality_id", $l->location_id, "en") : '',
                    'city'=> $l->city_id ? get_name_by_id("city_names", "city_id", $l->city_id, "en") : '',
                    'property_type'=> $l->property_category,
                    'status'=> $status
                );
            }
            
            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => $customArr,
                'pagination' => [
                            'current_page' => $recentPage,
                            'per_page' => $limit,
                            'total_pages' => ceil($total_count / $limit),
                        ],
            ], 200);  
        }else{
            return response()->json([
                'status' => 0,
                'message' => 'Failed to retrieve data.',
                'data' => [],
            ], 200); 
        }
    }

    public function upload_file(Request $req)
    {
        $req->validate([
            'images' => 'required',
            'images.*' => 'image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $uploadedFiles = [];

        if ($req->hasFile('images')) {
            $images = $req->file('images');

            $images = is_array($images) ? $images : [$images];

            foreach ($images as $file) {
                $fileName = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('user_upload/advertisement'), $fileName);
                $uploadedFiles[] = $fileName;
                $fileUrls[] = asset('user_upload/advertisement/' . $fileName);
            }
            return response()->json([
                'status' => 1,
                'message' => 'File successfully uploaded',
                'files' => $uploadedFiles,
                'image_url' => $fileUrls
            ]);
        }

        return response()->json(['error' => 'No files uploaded'], 400);
    }

    public function delete_ad_request(Request $request)
    {
        $user_id = $request->user_id;
        $request_id = $request->request_id;
        $logged_user_id = auth_user_id();
        if($user_id == $logged_user_id)
        {
            $up = $this->apiModel->deleteAdRequest($request_id);
            if($up)
            {
                return response()->json([
                    'status' => 1,
                    'message' => 'Request deleted successfully !',
                ], 200);
            }else{
                return response()->json([
                    'status' => 0,
                    'message' => 'Failed to delete !',
                ], 200);
            }
        }else{
            return response()->json([
                'status' => 0,
                'message' => 'User id not matched !',
            ], 200);
        }
    }


}

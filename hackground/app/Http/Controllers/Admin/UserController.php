<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Controller;
use App\Models\AgentAdditional;
use App\Models\Api\ApiModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    protected $memberUserModel;
    protected $apiModel;

    /**
     * Inject MemberUserModel via Dependency Injection.
     */
    public function __construct(User $memberUserModel, ApiModel $apiModel)
    {
        $this->memberUserModel = $memberUserModel;
        $this->apiModel = $apiModel;
        $this->middleware('view_permit:all-users');
    }
    public function MemberUserView(Request $request, string $typeName = null)
    {
        $paginate = 10;
        $term = $request->input('term');
        $typekey = strtoupper(substr($typeName, 0, 1));
        if ($typekey == null) {
            $data = $this->memberUserModel->getMemberUsers($term, $paginate, $typekey);
            return view('Admin.Member.index', compact('data'));
        }

        $data = $this->memberUserModel->getMemberUsers($term, $paginate, $typekey);
        return view('Admin.Member.index', compact('data', 'typeName'));
    }

    public function MemberUserImage(Request $req)
    {
        $req->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        if ($req->hasFile('file')) {

            $file = $req->file('file');
            $fileName = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('user_upload/profile_image'), $fileName);


            return response()->json(['fileName' => $fileName]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }

    public function DeleteMemberUserImage(Request $req)
    {
        $filePath = public_path('memberUser_image/' . $req->file);

        if (file_exists($filePath)) {
            unlink($filePath);
            return response()->json(['success' => 'File deleted successfully']);
        }

        return response()->json(['error' => 'File not found', $filePath], 404);
    }

    public function AddMemberUser(Request $req)
    {
        $validatedData = $req->validate(
            [
                'user_name' => 'required|string|max:255',
                'user_type' => 'required|in:B,O,A',
                'user_phone' => 'required|regex:/^\+?[0-9]{6,15}$/|unique:users,phone',
                'wp_num' => 'required|regex:/^\+?[0-9]{6,15}$/|unique:users,whatsapp_no',
                'user_email' => 'required|email|max:255|unique:users,email',
                'password' => 'required|min:6|max:255|confirmed',
                'image' => 'nullable|string',
                'status' => 'required|boolean',
            ],
            [
                'required' => 'this field is required',
                'string' => 'this must be a string.',
                'max' => 'may not exceed :max characters.',
                'in' => 'invalid.',
                'digits_between' => 'must be between :min and :max digits.',
                'unique' => 'already been taken.',
                'email' => 'enter valid email address.',
                'confirmed' => 'password does not match.',
            ]
        );

        try {
            $response = $this->memberUserModel->createMemberUser($validatedData);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function MemberUserDetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Member User ID is required.'], 400);
        }

        $data = $this->memberUserModel->getMemberUsersDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'MemberUser not found.'], 404);
        }

        return response()->json($data[0]);
    }


    public function UpdateMemberUser(Request $req)
    {

        $validatedData = $req->validate(
            [
                'user_name' => 'required|string|max:255',
                'user_type' => 'required|in:B,O,A',
                'user_phone' => 'required|regex:/^\+?[0-9]{6,15}$/',
                'wp_num' => 'required|regex:/^\+?[0-9]{6,15}$/',
                'user_email' => 'required|email|max:255|unique:users,email,' . $req->usersId,
                'password' => 'nullable|min:6|max:255|confirmed',
                'image' => 'nullable|string',
                'status' => 'required|boolean',
            ],
            [
                'required' => 'this field is required',
                'string' => 'this must be a string.',
                'max' => 'may not exceed :max characters.',
                'in' => 'invalid.',
                'digits_between' => 'must be between :min and :max digits.',
                'unique' => 'already been taken.',
                'email' => 'enter valid email address.',
                'confirmed' => 'password does not match.',
            ]
        );

        try {
            $response = $this->memberUserModel->updateMemberUser($validatedData, $req->usersId);

            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function MemberUserStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->memberUserModel->MemberUserStatusUpdate($data);
        return response()->json($response);
    }

    public function MemberUserAgentStatus(Request $req)
    {
        $response = User::where('id', $req->id)->update(['is_verified_agent' =>  $req->status]);
        return response()->json($response);
    }

    public function MemberUserDelete(String $id)
    {
        $response = $this->memberUserModel->DeleteMemberUser($id);
        return response()->json($response);
    }

    public function MemberUserAllDetails(String $id, $lang = 'en')
    {
        $data = $this->memberUserModel->getUserFullDetails($id);

        $cities = $this->apiModel->getCity($lang);

        return view('Admin.Member.member_details', compact('data', 'cities'));
    }

    public function SaveMemberDetails(Request $req)
    {
        
        log_anything($req->all());

        $user_id = $req->user_id;
        $user_type = $req->user_type;

        $requestData1 = [
            'name' => $req->name,
            'email' => $req->email,
            'phone_code' => $req->phone_code,
            'phone' => $req->phone,
            'whatsapp_no' => $req->w_number,
            'address' => $req->address,
            'city' => $req->city,
            'website_title' => $req->web_title,
            'website_url' => $req->web_url,
            'description' => $req->comment,
            'updated_at' => now(),
        ];
        $update  = $this->apiModel->UpdateMyProfileData($user_id, $requestData1);

        if ($user_type === 'A') {

            $requestData2 = [
                'license_no' => $req->license_no,
                'experience_yr' => $req->experience_yr,
                'specialization' => $req->specialization,
                'broker_type' => $req->broker_type,
                'bussiness_phone' => $req->bussiness_phone,
                'bussiness_email' => $req->bussiness_email,
                'opening_hours' => $req->opening_hours,
                'closing_hours' => $req->closing_hours,
                'company_name' => $req->company_name,
            ];

            $data = array_filter($requestData2, function ($value) {
                return !is_null($value) && $value !== '';
            });

            $insert = AgentAdditional::updateOrCreate(
                ['agent_id' => $user_id],
                $data
            );
        }

        return redirect()->back();
    }
}

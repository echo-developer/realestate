<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    protected $memberUserModel;

    /**
     * Inject MemberUserModel via Dependency Injection.
     */
    public function __construct(User $memberUserModel)
    {
        $this->memberUserModel = $memberUserModel;
    }
    public function MemberUserView(Request $request, String $typeName = null, String $term = null)
    {
        $paginate = 10;
        $typekey = strtoupper(substr($typeName, 0, 1));
        if ($typekey == null) {
            $data = $this->memberUserModel->getMemberUsers($term, $paginate, $typekey);
            return view('Admin.Member.index', compact('data'));
        }

        $data = $this->memberUserModel->getMemberUsers($term, $paginate, $typekey);
        return view('Admin.Member.index', compact('data'));
    }

    public function MemberUserImage(Request $req)
    {
        $req->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        if ($req->hasFile('file')) {

            $file = $req->file('file');
            $fileName = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('memberUser_image'), $fileName);


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
                'user_phone' => 'required|digits_between:10,15|unique:users,phone',
                'wp_num' => 'required|digits_between:10,15|unique:users,whatsapp_no',
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
            return response()->json(['error' => 'MemberUser ID is required.'], 400);
        }

        $data = $this->memberUserModel->getMemberUsersDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'MemberUser not found.'], 404);
        }

        return response()->json($data);
    }
    public function EditMemberUser(Request $req)
    {

        $langs = array_keys($req->input('name', []));

        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'image' => 'nullable|string',
            'prop_memberUserId' => 'required|integer|exists:pref_property_memberUser,id',  // Ensure memberUser exists
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
            'prop_memberUserId.required' => 'The MemberUser ID field is required.',
            'prop_memberUserId.exists' => 'The specified MemberUser ID does not exist.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);
        $validated['country_id'] = $req->countryId;

        try {
            $response = $this->memberUserModel->updateMemberUser($validated);

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

    public function MemberUserDelete(Request $req)
    {
        $response = $this->memberUserModel->DeleteMemberUser($req->id);
        return response()->json($response);
    }
}

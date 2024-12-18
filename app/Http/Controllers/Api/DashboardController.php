<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }

    public function get_user_profile($id)
    {

        try {
            $data = $this->apiModel->getUser($id);

            if ($data->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No result found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error in retrieved Data: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving data.',
                'error' => 'Unexpected error occurred.',
            ]);
        }
    }

    public function update_profile_image(Request $request)
    {
        // Validate the incoming request
        try {
           $request->validate([
                'image' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
            ]);
    
            $id = $request->id;
    
            if ($request->hasFile('image')) {
                // Retrieve the user's current image
                $user = User::find($id);
                $oldImage = $user->image;
    
                // Handle the uploaded file
                $file = $request->file('image');
                $fileName = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('profile_image'), $fileName);
    
                // Delete the old image from the server if it exists
                if ($oldImage && file_exists(public_path('profile_image/' . $oldImage))) {
                    unlink(public_path('profile_image/' . $oldImage));
                }
    
                // Update the database with the new image filename
                $update = $user->update(['image' => $fileName]);
    
                if ($update) {
                    return response()->json([
                        'status' => true,
                        'message' => 'Profile image updated successfully.',
                        'data' => [
                            'file_name' => $fileName,
                            'image_url' => asset('profile_image/' . $fileName),
                        ],
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Failed to update the profile image in the database.',
                    ]);
                }
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Handle other exceptions
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the profile image.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
}

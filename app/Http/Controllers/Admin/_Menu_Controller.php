<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuManagementModel;
use Illuminate\Http\Request;

class _Menu_Controller extends Controller
{
    protected $menuModel;

    /**
     * Inject MenuModel via Dependency Injection.
     */
    public function __construct(MenuManagementModel $menuModel)
    {
        $this->menuModel = $menuModel;
    }
    public function MenuView(Request $request)
    {
        $term = $request->input('term');
        $data = $this->menuModel->getMenus($term);
        return view('Admin.Menu-Management.menu_management', compact('data'));
    }

    // public function MenuImage(Request $req)
    // {
    //     $req->validate([
    //         'file' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
    //     ]);

    //     if ($req->hasFile('file')) {

    //         $file = $req->file('file');
    //         $fileName = time() . '-' . $file->getClientOriginalName();
    //         $file->move(public_path('menu_image'), $fileName);


    //         return response()->json(['fileName' => $fileName]);
    //     }

    //     return response()->json(['error' => 'No file uploaded'], 400);
    // }

    // public function deleteMenuImage(Request $req)
    // {
    //     $filePath = public_path('menu_image/' . $req->file);

    //     if (file_exists($filePath)) {
    //         unlink($filePath);
    //         return response()->json(['success' => 'File deleted successfully']);
    //     }

    //     return response()->json(['error' => 'File not found', $filePath], 404);
    // }

    public function addMenu(Request $req)
    {
        $validatedData = $req->validate([

            'menu_name' => 'required|string|max:255',
            'menu_slug' => 'required|string|max:255|unique:pref_menu_management,slug',
            'menu_desc' => 'required|string|max:500',
            'menu_action' => 'required|in:add,edit,delete,list',
            'menu_url' => 'required|max:255',
            'menu_status' => 'required|boolean',
        ], [

            'menu_name.required' => 'The Menu Name is required.',
            'menu_slug.unique' => 'The Slug must be unique.',
            'menu_action.in' => 'The selected action is invalid.',
            'menu_url.required' => 'The URL is required.',
            'menu_status.required' => 'The Status is required.',
        ]);

        $validatedData = array_merge($validatedData, [
            'menu_order' => $req->menu_order,
            'menu_icon' => $req->menu_icon,
        ]);

        if($req->parent_id){
            $validatedData = array_merge($validatedData, [
                'parent_id' => $req->parent_id,
            ]);
        }

        try {
            $response = $this->menuModel->createMenu($validatedData);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function MenuDetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Menu ID is required.'], 400);
        }

        $data = $this->menuModel->getMenusDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Menu not found.'], 404);
        }

        return response()->json($data);
    }

    public function EditMenu(Request $req)
    {
        $rules = [

            'menu_name' => 'required|string|max:255',
            'menu_slug' => 'required|string|max:255|unique:pref_menu_management,slug,'.$req->menuID,
            'menu_desc' => 'required|string|max:500',
            'menu_action' => 'required|in:add,edit,delete,list',
            'menu_url' => 'required|max:255',
            'menu_status' => 'required|boolean',
        ];

        // Custom validation messages (same as add menu)
        $messages = [

            'menu_name.required' => 'The Menu Name is required.',
            'menu_slug.unique' => 'The Slug must be unique.',
            'menu_action.in' => 'The selected action is invalid.',
            'menu_url.required' => 'The URL is required.',
            'menu_status.required' => 'The Status is required.',
        ];

        // Validate the request (same as add menu)
        $validated = $req->validate($rules, $messages);

        $validated = array_merge($validated, [
            'menu_order' => $req->menu_order,
            'menu_icon' => $req->menu_icon,
            'id' => $req->menuID,
        ]);

        try {
            // Call the method to update the menu in the model
            $response = $this->menuModel->updateMenu($validated);

            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function MenuStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->menuModel->MenuStatusUpdate($data);
        return response()->json($response);
    }

    public function MenuDelete(Request $req)
    {
        $response = $this->menuModel->DeleteMenu($req->id);
        return response()->json($response);
    }
}

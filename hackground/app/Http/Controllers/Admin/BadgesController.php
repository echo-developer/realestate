<?php

namespace App\Http\Controllers\Admin;

use App\Models\Badges;
use App\Models\BadgesNames;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BadgesController extends Controller
{
    public function __construct()
    {
        $this->middleware('view_permit:badges');
    }

    public function index(Request $request)
    {
        $term = $request->input('term');

        $query = BadgesNames::with(['badge' => function ($q) {
            $q->select('badge_id', 'icon', 'status');
        }])
            ->whereHas('badge', function ($q) {
                $q->where('status', '!=', config('constants.STATUS_DELETE'));
            })
            ->where('lang', config('app.locale'))
            ->select('badge_id', 'name', 'description');
        if (!empty($term)) {
            $query->where('name', 'like', '%' . $term . '%');
        }
        $list = $query->orderByDesc('badge_id')->paginate(10);
        // dd($list);
        return view('Admin.badges', compact('list'));
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('file') && $request->file('file')->isValid()) {

            $file = $request->file('file');
            $fileName = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('user_upload/badges/'), $fileName);
            $fileUrl = asset('user_upload/badges/' . $fileName);
            return response()->json(['success' => true, 'fileName' => $fileName, 'fileUrl' => $fileUrl]);
        }

        return response()->json(['error' => 'Invalid file'], 400);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $langs = array_unique(array_merge(explode(',', admin_default_lang()), array_keys($request->input('name', []))));

        $validated = $request->validate([
            'name.*' => 'required|string|max:255',
            'description.*' => 'required|string',
            'status' => 'required|in:0,1',
        ]);

        // Save badge base info
        $slugName = $validated['name']['en'] ?? reset($validated['name']);
        $badge = Badges::create([
            'slug' => Str::slug($slugName),
            'icon' => $request->file_name ?? null,
            'status' => $request->status,
        ]);

        // Save translations
        foreach ($langs as $lang) {
            if (isset($validated['name'][$lang])) {
                \DB::table('badges_names')->updateOrInsert(
                    [
                        'badge_id' => $badge->badge_id,
                        'lang' => $lang,
                    ],
                    [
                        'name' => $validated['name'][$lang] ?? '',
                        'description' => $validated['description'][$lang] ?? '',
                    ]
                );
            }
        }

        return response()->json([
            'status' => 1,
            'message' => 'Badges created successfully'
        ]);
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Check if ID is provided
        if (!$id) {
            return response()->json([
                'status' => 0,
                'message' => 'ID is required'
            ], 400);
        }

        $data  = Badges::select('badge_id', 'icon', 'status')->with('names') // Load the related names and descriptions
            ->where('badge_id', $id)
            ->where('status', '!=', config('constants.STATUS_DELETE')) // Ensure the badge is not deleted
            ->first();

        // Check if the data exists
        if (!$data) {
            return response()->json([
                'status' => 0,
                'message' => 'Data not found'
            ], 404);
        }
        $data->fileurl = asset('user_upload/badges/' . $data->icon);
        return response()->json([
            'status' => 1,
            'data' => $data
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'name.*' => 'required|string|max:255',
            'description.*' => 'required|string',
            'status' => 'required|in:0,1',
        ]);

        Badges::where('badge_id', $id)->update([
            'icon' => $request->file_name,
            'status' => $request->status,
        ]);

        foreach ($validated['name'] as $lang => $name) {
            \DB::table('badges_names')->updateOrInsert(
                [
                    'badge_id' => $id,
                    'lang' => $lang,
                ],
                [
                    'name' => $name,
                    'description' => $validated['description'][$lang] ?? '',
                ]
            );
        }


        return response()->json(['status' => 1, 'message' => 'Badge updated successfully']);
    }

    public function statusUpdate(Request $request)
    {
        $status = $request->input('status');
        $id = $request->input('id');
        Badges::where('badge_id', $id)->update(['status' => $status]);
        return response()->json(['success' => true, 'message' =>  $status == 1 ? 'Item activated successfully' : 'Item dectivated successfully']);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Badges::where('badge_id', $id)->update(['status' => config('constants.STATUS_DELETE')]);
        return response()->json([
            'success' => true,
            'message' => 'Item deleted successfully.',
        ]);
    }
}

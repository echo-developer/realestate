<?php

namespace App\Http\Controllers\Admin;

use App\Models\MetaData;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MetaController extends Controller
{
    public function listMeta()
    {
        $meta = MetaData::where('status', '!=', config('constants.STATUS_DELETE'))->paginate(10);

        return view('Admin.page_meta', compact('meta'));
    }

    public function store(Request $req)
    {
        MetaData::create($req->all());
        return response()->json(['status' => 1, 'message' => 'Meta created successfully']);
    }
    public function edit(string $id = null)
    {
        if (!$id) {
            return response()->json([
                'status' => 0,
                'message' => 'ID is required'
            ], 400);
        }

        $meta = MetaData::find($id);

        if (!$meta) {
            return response()->json([
                'status' => 0,
                'message' => 'Meta not found'
            ], 404);
        }

        return response()->json($meta);
    }

    public function update(Request $request, string $id)
    {


        MetaData::where('id', $id)
            ->update([
                'page_name' => $request->page_name,
                'meta_title' => $request->meta_title,
                'meta_key' => $request->meta_key,
                'meta_description' => $request->meta_description,
                'page' => $request->page,
                'status' => $request->status,
            ]);


        return response()->json(['status' => 1, 'message' => 'Meta Updated successfully']);
    }
    public function statusUpdate(Request $request)
    {
        $status = $request->input('status');
        $id = $request->input('id');
        MetaData::where('id', $id)->update(['status' => $status]);
        return response()->json(['success' => true, 'message' =>  $status == 1 ? 'Item activated successfully' : 'Item dectivated successfully']);
    }
    public function destroy(string $id)
    {
        $metaData = MetaData::findOrFail($id);
        $metaData->delete();
        return response()->json([
            'success' => true,
            'message' => 'Item deleted successfully.',
        ]);
    }
    public function activateMultiple(Request $request)
    {
        $ids = $request->input('ids');
        MetaData::whereIn('id', $ids)->update(['status' => 1]);

        return response()->json(['success' => true, 'message' => 'Items activated successfully']);
    }
    public function deactivateMultiple(Request $request)
    {
        $ids = $request->input('ids');
        MetaData::whereIn('id', $ids)->update(['status' => 0]);

        return response()->json(['success' => true, 'message' => 'Items deactivated successfully']);
    }
    public function deleteMultiple(Request $request)
    {
        $ids = $request->input('ids');
        MetaData::whereIn('id', $ids)->delete();

        return response()->json(['success' => true, 'message' => 'Items deleted successfully']);
    }
}

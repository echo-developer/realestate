<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\FeaturedPackageService;
use Illuminate\Http\Request;

class FeaturedPackageController extends Controller
{
    protected $service;

    public function __construct(FeaturedPackageService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $packages = $this->service->getAll();
        return view('Admin.FeaturedPackage.index', compact('packages'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:100',
            'description'      => 'nullable|string|max:500',
            'price'            => 'required|numeric|min:0',
            'duration_days'    => 'required|integer|min:1',
            'properties_count' => 'required|integer|min:1',
            'status'           => 'required|in:0,1',
        ]);

        $this->service->create($data);

        return response()->json(['success' => true, 'message' => 'Package created successfully.']);
    }

    public function edit($id)
    {
        $package = $this->service->find($id);
        return response()->json(['success' => true, 'data' => $package]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:100',
            'description'   => 'nullable|string|max:500',
            'price'         => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'status'        => 'required|in:0,1',
        ]);

        $this->service->update($data, $request->id);

        return response()->json(['success' => true, 'message' => 'Package updated successfully.']);
    }

    public function destroy(Request $request)
    {
        $this->service->delete($request->id);
        return response()->json(['success' => true, 'message' => 'Package deleted successfully.']);
    }

    public function status(Request $request)
    {
        $this->service->changeStatus($request->id, $request->status);
        return response()->json(['success' => true, 'message' => 'Status updated.']);
    }
}

<?php

namespace App\Services;

use App\Models\FeaturedPackage;
use Illuminate\Support\Facades\DB;

class FeaturedPackageService
{
    public function getAll()
    {
        return FeaturedPackage::where('status', '!=', 2)->orderByDesc('id')->paginate(15);
    }

    public function getActive()
    {
        return FeaturedPackage::active()->orderBy('price')->get();
    }

    public function find($id)
    {
        return FeaturedPackage::findOrFail($id);
    }

    public function create(array $data): FeaturedPackage
    {
        return FeaturedPackage::create([
            'name'          => $data['name'],
            'description'   => $data['description'] ?? null,
            'price'         => $data['price'],
            'duration_days' => $data['duration_days'],
            'status'        => $data['status'],
        ]);
    }

    public function update(array $data, $id): FeaturedPackage
    {
        $pkg = $this->find($id);
        $pkg->update([
            'name'          => $data['name'],
            'description'   => $data['description'] ?? null,
            'price'         => $data['price'],
            'duration_days' => $data['duration_days'],
            'status'        => $data['status'],
        ]);
        return $pkg;
    }

    public function delete($id): void
    {
        $pkg = $this->find($id);
        $pkg->status = 2;
        $pkg->save();
    }

    public function changeStatus($id, $status): void
    {
        FeaturedPackage::where('id', $id)->update(['status' => $status]);
    }
}

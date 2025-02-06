<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\PrefFloorPlanType;
use App\Http\Controllers\Controller;
use App\Models\PrefProject;

class FloorPlanController extends Controller
{

    public function view()
    {
        $floorPlanTypes = PrefFloorPlanType::with(['names' => function ($query) {
            $query->where('lang', 'en');
        }])->get();
        
        $project = PrefProject::where([
            ['status', 1],
            ['is_deleted', false],
        ])->select(['id', 'project_name', 'slug'])
        ->get();

        return view('Admin.Project_Setting.floor_plan', compact('floorPlanTypes','project'));
    }
}

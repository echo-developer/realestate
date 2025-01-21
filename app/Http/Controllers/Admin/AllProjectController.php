<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PrefProject;

class AllProjectController extends Controller
{
    public function AllProjectView()
    {
        $project = PrefProject::leftjoin('pref_project_settings', 'pref_project.id', '=', 'pref_project_settings.project_id')
            ->leftjoin('pref_project_additional','pref_project.id', '=', 'pref_project_additional.project_id')
            ->select('pref_project.*', 'pref_project_settings.*')
            ->get();
        dd($project);
    }
}

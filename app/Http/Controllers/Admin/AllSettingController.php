<?php

namespace App\Http\Controllers\Admin;

use App\Models\AllSettings;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\GroupSetting;

class AllSettingController extends Controller
{

    public function view_AllsettingList(String $group_key){

        $Settings = GroupSetting::get();
        $all_settings = AllSettings::where('setting_group',$group_key)->get();

        return view('Admin/Setting/all_setting',compact('Settings','all_settings'));


    }

    public function addnewSetting(Request $request){

        // return response($request);

        $validate_setting = $request->validate(
            [
                'Groups' => 'required',
                'setting_name' => 'required|max:20',
                'setting_Key' => 'required|max:20',
                'setting_Value' => 'required',
                'Display_Order' => 'required',
                'Editable' => 'required',
                'Deletable' => 'required',
            ]
        );

        $insert_setting = [
            'title' => $validate_setting['setting_name'],
            'setting_key' => $validate_setting['setting_Key'],
            'setting_value' => $validate_setting['setting_Value'],
            'editable' => $validate_setting['Editable'],
            'deletable' => $validate_setting['Deletable'],
            'display_order' => $validate_setting['Display_Order'],
            'setting_group' => $validate_setting['Groups'],
        ];

        $all_setting = AllSettings::create($insert_setting);

        if ($all_setting) {
            session()->flash('success_msg', 'Setting added successfully');
            session()->flash('message_type', 'success');
        } else {
            session()->flash('success_msg', 'Failed to add');
            session()->flash('message_type', 'danger');
        }

        return response()->json($all_setting);

    }

    
}

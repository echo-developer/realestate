<?php

namespace App\Http\Controllers\Admin;

use App\Models\AllSettings;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\GroupSetting;

class AllSettingController extends Controller
{

    public function view_AllsettingList(String $group_key)
    {

        $Settings = GroupSetting::get();
        $all_settings = AllSettings::where('setting_group', $group_key)
            ->where('status', '!=', config('constants.STATUS_DELETE'))->get();

        return view('Admin/Setting/all_setting', compact('Settings', 'all_settings', 'group_key'));
    }

    public function addnewSetting(Request $request)
    {

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

    public function show_Setting_forEdit(String $sett_id)
    {

        $all_settings = AllSettings::where('id', $sett_id)->first();
        return response()->json($all_settings);
    }

    public function allSetting_update(Request $request)
    {

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

        $updated_setting = [

            'title' => $validate_setting['setting_name'],
            'setting_key' => $validate_setting['setting_Key'],
            'setting_value' => $validate_setting['setting_Value'],
            'editable' => $validate_setting['Editable'],
            'deletable' => $validate_setting['Deletable'],
            'display_order' => $validate_setting['Display_Order'],
            'setting_group' => $validate_setting['Groups'],
        ];

        $upd_setting = AllSettings::where('id', $request->settingsId)->update($updated_setting);

        if ($upd_setting) {
            return response()->json($upd_setting);
            session()->flash('success_msg', 'Setting Updated successfully');
            session()->flash('message_type', 'success');
        } else {
            session()->flash('success_msg', 'Failed to Update');
            session()->flash('message_type', 'danger');
        }
    }

    public function delete_Setting(Request $request, String $sett_id)
    {

        $dlt_setting = AllSettings::where('id', $sett_id)->update(['status' => $request->status]);
        return response()->json($dlt_setting);
    }


    public function settings_search(Request $request)
    {
        return response()->json($request);

        $term = $request->get('term');
        $groupKey = $request->get('group_key', 'default');

        $all_settings = AllSettings::where('setting_group', $groupKey)
            ->where(function ($query) use ($term) {
                $query->where('title', 'like', '%' . $term . '%')
                    ->orWhere('setting_key', 'like', '%' . $term . '%')
                    ->orWhere('setting_value', 'like', '%' . $term . '%');
            })
            ->get();

        $html = view('Admin.PartialView.AllSetting.allSetting', compact('all_settings'))->render();

        return response()->json(['html' => $html]);
    }
}

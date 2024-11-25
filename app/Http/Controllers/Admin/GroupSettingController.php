<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GroupSetting;
use Illuminate\Http\Request;

class GroupSettingController extends Controller
{
    public function group_setting_view()
    {
        $group_settings = GroupSetting::where('status', '!=', config('constants.STATUS_DELETE'))->get();
        return view('Admin/Setting/setting_group')->with(compact('group_settings'));
    }

    public function addnew_groupSetting(Request $request)
    {

        $validate_grp_setting = $request->validate(
            [
                'group_name' => 'required|max:20',
                'group_Key' => 'required|max:20',
                'status' => 'required',
            ]
        );

        $insert_grp_setting =
            [
                'group_name' => $validate_grp_setting['group_name'],
                'group_key' => $validate_grp_setting['group_Key'],
                'status' => $validate_grp_setting['status'],
            ];


        $new_grp_setting = GroupSetting::create($insert_grp_setting);

        set_flash_message('add');

        return response()->json($new_grp_setting);
    }


    public function showsingleGrpSetting(String $id){

        $grp_setting = GroupSetting::where('setting_group_id', $id)->first();
        return response()->json($grp_setting);
    }

    public function update_groupSetting(Request $request){

        $validate_grp_setting = $request->validate(
            [
                'group_name' => 'required|max:20',
                'status' => 'required',
            ]
        );

        $upd_grp_setting = GroupSetting::where('setting_group_id', $request->groupId)->update([
            'group_name' => $validate_grp_setting['group_name'],
                'status' => $validate_grp_setting['status'],
        ]);

        if ($upd_grp_setting) {
            set_flash_message('update');
        }

        return response()->json($upd_grp_setting);
    }

    public function grp_settings_toggle_sts(Request $request){

        $upd_grp_setting_status = GroupSetting::where('setting_group_id', $request->setting_Id)->update(['status' => $request->status]);
        return response()->json($upd_grp_setting_status);

    }

    public function delete_GroupSetting(Request $request , String $id){

        $dlt_grp_setting= GroupSetting::where('setting_group_id', $id)->update(['status' => $request->status]);
        
        if ($dlt_grp_setting) {
            set_flash_message('delete');
        } 
        
        return response()->json($dlt_grp_setting);

    }

    
}

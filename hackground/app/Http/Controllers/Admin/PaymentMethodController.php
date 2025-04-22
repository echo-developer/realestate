<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use LDAP\Result;

class PaymentMethodController extends Controller
{
    public function paymentMethodView()
    {

        $data = DB::table('payment_methods')->get();
        return view('Admin.Setting.payment_methods', compact('data'));
    }

    public function updatePaymentMethod(Request $req)
    {
        // log_anything($req->all());selected_method

        $methodsIds = json_decode($req->selected_method, true);

        DB::table('payment_methods')
            ->update(['is_active' => config('constants.STATUS_INACTIVE')]);

        if (!empty($methodsIds)) {
            DB::table('payment_methods')
                ->whereIn('id', $methodsIds)
                ->update(['is_active' => config('constants.STATUS_ACTIVE')]);
        }
        set_flash_message('update');
        return redirect()->back();
    }

    public function fetchActivePaymentMethod() {
        try {
            
            

        } catch (\Throwable $th) {
            throw $th;
        }
    }
}

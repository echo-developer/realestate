<?php

namespace App\Http\Controllers\Api;

use App\Models\BankLoan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BankController extends Controller
{
    public function BankDetails()
    {

        $data = BankLoan::select('id', 'bank_name', 'interest_rate', 'processing_fees', 'logo', 'status')->where('status', config('constants.STATUS_ACTIVE'))->get();

        return response()->json([
            'status' => 1,
            'message' => 'Data retrieved successfully.',
            'data' =>  $data
        ]);
    }
}

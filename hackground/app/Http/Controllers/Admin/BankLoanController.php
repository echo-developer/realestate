<?php

namespace App\Http\Controllers\Admin;
use App\Models\BankLoan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BankLoanController extends Controller
{
    public function index()
    {

        $data = BankLoan::select('id', 'bank_name', 'interest_rate', 'processing_fees', 'logo', 'status')->where('status', config('constants.STATUS_ACTIVE'))->get();

        return view('Admin.bank_loan', compact('data'));
    }

    public function store(Request $request)
    {
        $data = [
            'bank_name' => $request->name,
            'interest_rate' => $request->interest_rate,
            'processing_fees' => $request->processing_fees,
            'logo' => $request->filename,
            'status' => (int)$request->status
        ];

        BankLoan::create($data);

        return response()->json([
            'status' => true,
            'data' => $request->all()
        ]);
    }


    public function upload(Request $request)
    {

        $file = $request->file('logo');

        $fileName = time() . '-' . $file->getClientOriginalName();
        $file->move(public_path('user_upload/bank/'), $fileName);
        $uploadedFile = $fileName;
        $fileUrls = asset('user_upload/bank/' . $fileName);

        return response()->json([
            'status' => true,
            'message' => 'Files successfully uploaded',
            'file' => $uploadedFile,
        ]);
    }
}

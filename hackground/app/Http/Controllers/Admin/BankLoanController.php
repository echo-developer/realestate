<?php

namespace App\Http\Controllers\Admin;

use App\Models\BankLoan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BankLoanController extends Controller
{
    public function index()
    {

        $data = BankLoan::select('id', 'bank_name', 'interest_rate', 'processing_fees', 'logo', 'status')->where('status','!=' ,config('constants.STATUS_DELETE'))->get();

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

        $bankLoan = BankLoan::updateOrCreate(
            ['id' => $request->id],
            $data
        );

        return response()->json([
            'status' => true,
            'message' => $request->id ? 'Updated successfully' : 'Created successfully',
            'data' => $bankLoan
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

    public function edit($id)
    {

        $data = BankLoan::select('id', 'bank_name', 'interest_rate', 'processing_fees', 'logo', 'status')->where('id', $id)->first();

        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }

    public function destroy(Request $request)
    {
        $updated = BankLoan::where('id', $request->id)->update(['status' => -1]);

        if ($updated) {
            return response()->json([
                'status' => true,
                'message' => 'Deleted successfully.'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Bank loan not found or update failed.'
            ]);
        }
    }

    public function status(Request $request)
    {
        $updated = BankLoan::where('id', $request->id)->update(['status' => $request->status]);

        if ($updated) {
            return response()->json([
                'status' => true,
                'message' => 'Status Upadted.'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Status Upadtede failed.'
            ]);
        }
    }
    
}

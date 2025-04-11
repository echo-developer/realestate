<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoanEnquery;
use Illuminate\Http\Request;

class LoanEnqueryController extends Controller
{
    protected $loanEnqueryModel;
    public function __construct(LoanEnquery $loanEnqueryModel)
    {
        $this->middleware('view_permit:loan-enquery');
        $this->$loanEnqueryModel = $loanEnqueryModel;
    }
    public function loanEnquery(Request $request)
    {
        try {
            $paginate = 10;
            $data = LoanEnquery::latest()->paginate($paginate);
            return view('Admin.LoanEnquery.loan_enquery',compact('data'));
        } catch (\Throwable $e) {
            throw $e;
        }
    }
}

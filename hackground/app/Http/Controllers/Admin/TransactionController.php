<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\UserTransaction;
use App\Services\TransactionService;
use App\Http\Controllers\Controller;

class TransactionController extends Controller
{
    protected $transactions;
    public function __construct()
    {
        $this->transactions = new TransactionService();
    }


    public function index(Request $request)
    {
        $pag = 10;
        $filters = $request->only(['txn_id', 'payment_datefrom', 'payment_dateto', 'plan_id','paid_by']);
        $transactions = $this->transactions->getTransactionList($filters, $pag);

        return view('Admin.Transaction.transaction_list', compact('transactions'));
    }

}

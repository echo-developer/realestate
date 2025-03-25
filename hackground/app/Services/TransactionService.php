<?php

namespace App\Services;

use App\Models\UserTransaction;

class TransactionService
{
    public function getTransactionList($filters, $pag)
    {
        $query = UserTransaction::select(
            'platform_txn_id',
            'paid_amount',
            'currency',
            'user_id',
            'plan_id',
            'paid_by',
            'payment_status',
            'created_at'
        )->with('user:id,name');

        // Apply filters
        if (!empty($filters['txn_id'])) {
            $query->where('platform_txn_id', 'LIKE', "%{$filters['txn_id']}%");
        }

        if (!empty($filters['plan_id'])) {
            $query->where('plan_id', $filters['plan_id']);
        }

        if (!empty($filters['payment_datefrom'])) {
            $query->whereDate('created_at', '>=', $filters['payment_datefrom']);
        }

        if (!empty($filters['payment_dateto'])) {
            $query->whereDate('created_at', '<=', $filters['payment_dateto']);
        }
        if (!empty($filters['paid_by'])) {
            $query->where('paid_by', 'LIKE', "%{$filters['paid_by']}%");
        }
        
        return $query->paginate($pag);
    }
}

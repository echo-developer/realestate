<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PropertyTransactionModel extends Model
{

    public function createTransaction(array $data)
    {

        $transacID = DB::table('pref_property_transaction')->insertGetId([

            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $TransactionName = array_map(function ($lang, $name) use ($transacID) {
            return [
                'transaction_id' => $transacID,
                'lang' => $lang,
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, array_keys($data['name']), $data['name']);

        DB::table('pref_property_transaction_names')->insert($TransactionName);

        set_flash_message('add');

        return [
            'message' => 'Category added successfully.',
            'transaction_id' => $transacID
        ];
    }

    public function gettransactions($term = null,$lang = 'en',$peginate)
    {
        $query = DB::table('pref_property_transaction_names')
            ->join('pref_property_transaction', 'pref_property_transaction_names.transaction_id', '=', 'pref_property_transaction.id')
            ->where([
                ['pref_property_transaction_names.lang', '=', $lang],
                ['pref_property_transaction.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'pref_property_transaction.id',
                'pref_property_transaction_names.name',
                'pref_property_transaction.order',
                'pref_property_transaction.status',
            );
        if ($term) {
            $query->where('pref_property_transaction_names.name', 'like', "%{$term}%");
        }
        return $query->paginate($peginate);
    }

    public function getTransactionDetails($id)
    {
        $Transaction = DB::table('pref_property_transaction_names')
            ->join('pref_property_transaction', 'pref_property_transaction_names.transaction_id', '=', 'pref_property_transaction.id')
            ->where('pref_property_transaction_names.transaction_id', '=', $id) // Filter by transaction_id, not id
            ->select(
                'pref_property_transaction_names.id',
                'pref_property_transaction_names.name',
                'pref_property_transaction.id as transaction_id',
                'pref_property_transaction.order',
                'pref_property_transaction.status',
                'pref_property_transaction_names.lang'  // Include language column to identify language
            )
            ->get();

        return $Transaction;
    }

    public function updatetransaction($data)
    {
        // Start a transaction to ensure atomicity
        DB::beginTransaction();

        try {
            // Update the category data in the pref_property_transaction table
            $transactionData = [
                'order' => $data['order'],
                'status' => $data['status'],
                'updated_at' => now(),
            ];

            DB::table('pref_property_transaction')
                ->where('id', $data['transaction_id'])
                ->update($transactionData);

            // Prepare the data for updating the category names in the pref_property_transaction_names table
            $TransactionNames = array_map(function ($lang, $name) use ($data) {
                return [
                    'transaction_id' => $data['transaction_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name']);

            // Update the category names table (same as createCategory)
            foreach ($TransactionNames as $TransactionName) {
                DB::table('pref_property_transaction_names')
                    ->where('transaction_id', $TransactionName['transaction_id'])
                    ->where('lang', $TransactionName['lang'])
                    ->update([
                        'name' => $TransactionName['name'],
                        'updated_at' => $TransactionName['updated_at'],
                    ]);
            }

            // Commit the transaction
            DB::commit();
            set_flash_message('update');

            return [
                'message' => 'Transaction updated successfully.',
                'transaction_id' => $data['transaction_id'],
            ];
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }

    public function TransactionstatusUpdate($data)
    {
        DB::table('pref_property_transaction')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'transaction status updated.',
        ];
    }


    public function DeleteTransaction($id = '')
    {
        DB::table('pref_property_transaction')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
            set_flash_message('delete');
        return [
            'message' => 'transaction deleted successfully.',
        ];
    }
    use HasFactory;
}

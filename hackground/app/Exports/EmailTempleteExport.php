<?php
namespace App\Exports;
use App\Models\EmailTemplateModel;
use Maatwebsite\Excel\Concerns\FromCollection;

class EmailTempleteExport implements FromCollection
{
    public function collection()
    {
        $emailTemplates = EmailTemplateModel::select('id','name', 'order', 'status') 
            ->where('status', '!=', config('constants.STATUS_DELETE'))
            ->paginate(10); 
            
        $emailTemplates->getCollection()->transform(function ($item) {
            switch ($item->status) {
                case 1:
                    $item->status = 'Active';
                    break;
                case 0:
                    $item->status = 'Inactive';
                    break;
                case -1:
                    $item->status = 'Deleted';
                    break;
                default:
                    $item->status = 'Unknown'; 
            }
            return $item;
        });

        return $emailTemplates;
    }
}

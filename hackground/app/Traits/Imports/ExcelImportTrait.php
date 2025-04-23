<?php

namespace App\Traits\Imports;

use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Validator;

trait ExcelImportTrait
{
    /**
     * Parse an uploaded Excel/CSV file dynamically and return its data.
     *
     * @param \Illuminate\Http\Request $request
     * @param string|null $inputName Optional. If not provided, will auto-detect the file input name.
     * @param bool $skipHeader If true, removes the first row (assumed to be header).
     * @return array Returns the parsed data rows as an array.
     * @throws \Exception
     */

    public function parseUploadedExcel($request, $inputName = null, $columns, $skipHeader = true)
    {
        if (!$inputName) {
            $inputName = collect($request->allFiles())->keys()->first();
        }

        $validator = Validator::make(
            $request->all(),
            [
                $inputName => 'required|file|mimes:xlsx,xls,csv',
            ],
            [
                "$inputName.required" => 'Please upload a file.',
                "$inputName.file"     => 'The uploaded input must be a valid file.',
                "$inputName.mimes"    => 'Only Excel or CSV files are allowed (xlsx, xls, csv).',
            ]
        );

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first($inputName));
        }

        $filePath = $request->file($inputName)->getPathname();
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        if ($skipHeader) {
            array_shift($rows);
        }

        $filteredRows = [];

        foreach ($rows as $row) {
            $limitedRow = array_slice($row, 0, $columns);
            $hasData = collect($limitedRow)->filter(function ($cell) {
                return trim((string) $cell) !== '';
            })->isNotEmpty();

            if ($hasData) {
                $filteredRows[] = $limitedRow;
            }
        }
        return $filteredRows;
    }


    public function parseUploadedExcelforLocality($request, $inputName = null, $columns, $skipHeader = true)
    {
        if (!$inputName) {
            $inputName = collect($request->allFiles())->keys()->first();
        }

        $validator = Validator::make(
            $request->all(),
            [
                $inputName => 'required|file|mimes:xlsx,xls,csv',
            ],
            [
                "$inputName.required" => 'Please upload a file.',
                "$inputName.file"     => 'The uploaded input must be a valid file.',
                "$inputName.mimes"    => 'Only Excel or CSV files are allowed (xlsx, xls, csv).',
            ]
        );

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first($inputName));
        }

        $filePath = $request->file($inputName)->getPathname();
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        $localityData = [];
        $landmarkData = [];

        if ($skipHeader) {
            $landmarkHeaderRow = array_slice(array_shift($rows), 5, 4);
        }

        $filteredRows = [];

        foreach ($rows as $row) {
            $limitedRow = array_slice($row, 0, $columns);
            $hasData = collect($limitedRow)->filter(function ($cell) {
                return trim((string) $cell) !== '';
            })->isNotEmpty();

            if ($hasData) {
                $filteredRows[] = $limitedRow;
            }
        }
        return $filteredRows;
    }
}

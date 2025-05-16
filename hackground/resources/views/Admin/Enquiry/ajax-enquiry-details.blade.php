<div class="modal-header">
    @php
        '<pre>' . print_r($enquiry) . '</pre>';
    @endphp
    <h5 class="modal-title" id="viewLeadModal">Lead Details</h5>

    <button type="button" class="btn-close" data-bs-dismiss="modal">

    </button>
</div>
<div class="modal-body">
    @if ($type == 'P')
        <table class="w-100">
            <tr>
                <td><b>Enquiry Id : </b></td>
                <td>{{ $enquiry->enquery_id }}</td>
            </tr>
            <tr>
                @if ($enquiry->property_id)
                    <td><b>Property Name : </b></td>
                    <td>{{ $enquiry->property_name }}</td>
                @elseif($enquiry->project_id)
                    <td><b>Project Name : </b></td>
                    <td>{{ $enquiry->project_name }}</td>
                @endif
            </tr>
            <tr>
                <td><b>Customer Name : </b></td>
                <td>{{ $enquiry->customer }}</td>
            </tr>
            <tr>
                <td><b>Customer Phone : </b></td>
                <td>{{ $enquiry->customer_phone }}</td>
            </tr>
            <tr>
                <td><b>Customer Email : </b></td>
                <td>{{ $enquiry->customer_email }}</td>
            </tr>
            <tr>
                <td><b>Owner : </b></td>
                <td>{{ $enquiry->owner }}</td>
            </tr>
            <tr>
                <td><b>Date : </b></td>
                <td>{{ date('d-M-Y', strtotime($enquiry->created_at)) }}</td>
            </tr>
            <tr>
                <td><b>Message : </b></td>
                <td>{{ $enquiry->message }}</td>
            </tr>
        </table>
    @elseif($type == 'G')
        <table class="w-100">
            <tr>
                <td><b>Enquiry Id : </b></td>
                <td>{{ $enquiry->id ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td><b>Buyer Name : </b></td>
                <td>{{ $enquiry->name ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td><b>Phone : </b></td>
                <td>{{ $enquiry->phone ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td><b>Email : </b></td>
                <td>{{ $enquiry->email ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td><b>Locality : </b></td>
                <td>{{ $enquiry->locality ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td><b>Purchase Timeline : </b></td>
                <td>
                    @php
                        if ($enquiry->purchase_timeline) {
                            $timeline_arr = explode('_', $enquiry->purchase_timeline);
                            if (isset($timeline_arr[0], $timeline_arr[1])) {
                                echo 'Within ' . $timeline_arr[0] . ' ' . $timeline_arr[1];
                            } else {
                                echo 'N/A';
                            }
                        }
                    @endphp

                </td>
            </tr>
            <tr>
                <td><b>Enquiry For : </b></td>
                <td>
                    @php
                        $subCat = get_property_sub_category_name($enquiry->property_for);
                        $cat = get_property_category_name($enquiry->property_type);
                    @endphp
                    {{ $subCat && $cat ? $subCat . ', ' . $cat : ($subCat ?: ($cat ?: 'N/A')) }}
                </td>
            </tr>
            <tr>
                <td><b>Budget : </b></td>
                <td>
                    @php
                        $min = $enquiry->min_budget;
                        $max = $enquiry->max_budget;
                    @endphp
                    {{ $min && $max ? $min . ' - ' . $max : ($min ?: ($max ?: 'N/A')) }}
                </td>
            </tr>
            <tr>
                <td><b>Size : </b></td>
                <td>
                    @php
                        $minSize = $enquiry->min_size;
                        $maxSize = $enquiry->max_size;
                    @endphp
                    {{ $minSize && $maxSize ? $minSize . ' - ' . $maxSize : ($minSize ?: ($maxSize ?: 'N/A')) }}
                </td>
            </tr>
            <tr>
                <td><b>Date : </b></td>
                <td>
                    {{ $enquiry->created_at ? date('d-M-Y', strtotime($enquiry->created_at)) : 'N/A' }}
                </td>
            </tr>

        </table>
    @endif
</div>
{{-- <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="button" onclick="add_edit()" id="button" class="btn btn-primary">Save</button>
</div> --}}

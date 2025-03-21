<div class="modal-header">

    <h5 class="modal-title" id="viewLeadModal">Lead Details</h5>

    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
<div class="modal-body">
    <table class="w-100">
        <tr>
            <td><b>Enquiry Id : </b></td>
            <td>{{ $enquiry->enquery_id }}</td>
        </tr>
        <tr>
            @if($enquiry->property_id)
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
</div>
{{-- <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="button" onclick="add_edit()" id="button" class="btn btn-primary">Save</button>
</div> --}}

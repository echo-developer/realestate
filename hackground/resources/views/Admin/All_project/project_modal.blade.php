<div class="modal-header">
    <h5 class="modal-title" id="ajaxModalLabel">Edit Project</h5>
    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
<div class="modal-body">
    <form role="form" id="add_form">
        @csrf
        <input type="hidden" name="project_id" value="{{$projectData->id}}" />
        <input type="hidden" name="step" value="{{$step}}" />
        @if($step==1)
        <div class="form-group">
            <label for="">Select Project Budget:</label>
            <input placeholder="Enter Project budget" id="" class="form-control" name="project_price" type="number" value="{{$projectData->additional->expected_price}}">
        </div>
        <div class="form-group">
            <label for="">Enter the value for instruction</label>
            <input placeholder="Edit instruction" id="" class="form-control"  name="instruction" type="text" value="{{$projectData->additional->instruction}}">
        </div>

        <div class="form-group">
            <label for="address-input">Enter the address:</label>
            <textarea placeholder="Enter the address here" rows="4" id="address-input" name="project_address" class="form-control" style="height: 100px;">{{$projectData->location->address}}</textarea>
        </div>

        <div class="form-group">
            <label for="locality">Locality</label>
            <input id="locality" class="form-control pac-target-input" type="text" name="project_locality" placeholder="Enter a location" value="{{$projectData->location->locality}}" autocomplete="off">
        </div>

        <div class="form-group">
            <label for="">Enter The Project Name</label>
            <input placeholder="Edit Project Name"  name="project_name" id="" class="form-control" value="{{$projectData->project_name}}" type="text">
        </div>
        @endif
        @if($step==2)


        @endif

        <button type="submit" class="btn btn-primary">Save</button>
        </form>
</div>

<script>
$(document).on('submit', '#add_form', function(e) {
    e.preventDefault();

    var formData = $(this).serialize(); 

    $.ajax({
        url: "{{url('project/edit-project')}}", 
        type: "POST",
        data: formData,
        success: function(response) {
            if (response.success) {
                alert("Data saved successfully!");
                // $('#ajaxModal').modal('hide'); 
            } else {
                alert("Error saving data.");
            }
        },
        error: function(xhr) {
            console.error("Error:", xhr.responseText);
        }
    });
});
</script>
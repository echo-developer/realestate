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
            <label>Post For:</label>
            <div>
                <label>
                    <input type="radio" name="post_for" value="rent"
                        {{ $projectData->settings->post_for == 'rent' ? 'checked' : '' }}> Rent
                </label>
                <label class="ml-3">
                    <input type="radio" name="post_for" value="sale"
                        {{ $projectData->settings->post_for == 'sale' ? 'checked' : '' }}> Sale
                </label>
            </div>
        </div>

        <div class="form-group">
            <label class="form-group">Property Type</label>
            <select class="form-control" name="project_type" id="project_type">
                <option value="">Select Project Type</option>

                @foreach ($projectTypes as $projectType)
                <option value="{{ $projectType->id }}"
                    {{ isset($projectData->settings->project_type) && $projectData->settings->project_type == $projectType->id ? 'selected' : '' }}>
                    {{ $projectType->name }}
                </option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="developer_name">Enter Developer Name</label>
            <input
                placeholder="Enter Developer Name"
                name="developer_name"
                id="developer_name"
                class="form-control"
                value="{{ $projectData->additional->developer_name ?? '' }}"
                type="text">
        </div>
        <div class="form-group">
            <label for="developer_details">Enter Developer Details</label>
            <textarea
                placeholder="Enter Developer Details"
                name="developer_details"
                id="developer_details"
                class="form-control"
                rows="4">{{ $projectData->additional->developer_details ?? '' }}</textarea>
        </div>
        <div class="form-group">
            <label for="developer_experience">Enter Developer Experience (in years)</label>
            <input
                placeholder="Enter Developer Experience"
                name="developer_experience"
                id="developer_experience"
                class="form-control"
                type="number"
                min="0"
                value="{{ $projectData->additional->developer_experience ?? '' }}">
        </div>

        <div class="form-group">
            <label for="">Enter the value for instruction</label>
            <input placeholder="Edit instruction" id="" class="form-control" name="instruction" type="text" value="{{$projectData->additional->instruction}}">
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
            <input placeholder="Edit Project Name" name="project_name" id="" class="form-control" value="{{$projectData->project_name}}" type="text">
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
                    $('#ajax_modal').modal('hide');
                    setTimeout(() => {
                        c_alert("Data saved successfully!", "success");
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    }, 500);
                } else {
                    $('#ajax_modal').modal('hide');
                    setTimeout(() => {
                        c_alert("Error saving data.", "error");
                    }, 500);
                }

            },
            error: function(xhr) {
                console.error("Error:", xhr.responseText);
            }
        });
    });
</script>
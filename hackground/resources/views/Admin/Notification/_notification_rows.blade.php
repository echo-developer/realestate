@foreach ($notifications as $notification)
<tr>

    <td>
        <div class="custom-checkbox custom-control">
            <input type="checkbox" id="item_229" class="custom-control-input check_all"
                name="ID[]" value="229">
            <label class="custom-control-label" for="item_229"></label>
        </div>
    </td>
    <td>{{ $notification->id }}</td>
    <td> {!! $notification->message !!}
        <div><small class="text-muted"> <i class="fa fa-clock"></i>
                {{ $notification->created_date }}</small></div>
    </td>
    <td>
        <input data-id="{{ $notification->id }}" class="toggle-class-noti d-none sts_chnage"
            type="checkbox" data-toggle="toggle" data-on="Read" data-off="Unread"
            data-onstyle="success" data-offstyle="danger" data-size="mini"
            {{ $notification->read_status ? 'checked' : '' }}>

    </td>
    <td class="text-right">
        <a noti_id="{{ $notification->id }}" class="delete-notification" title=""
            data-original-title="Delete Permanently"><i
                class="fa fa-trash text-danger fa-md"></i>
        </a>


    </td>
</tr>
@endforeach
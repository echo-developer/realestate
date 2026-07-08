@foreach ($notifications as $notification)
<tr>
    <td data-label="Select">
        <div>
            <div class="custom-checkbox custom-control">
                <input type="checkbox" id="item_{{ $notification->id }}" class="custom-control-input check_all"
                    name="ID[]" value="{{ $notification->id }}">
                <label class="custom-control-label" for="item_{{ $notification->id }}"></label>
            </div>
        </div>
    </td>
    <td data-label="ID"><span>#{{ $notification->id }}</span></td>
    <td data-label="Notification">
        <div>
            {!! $notification->message !!}
            <div class="mt-1"><small class="text-muted"> <i class="fa fa-clock"></i>
                    {{ $notification->created_date }}</small></div>
        </div>
    </td>
    <td data-label="Status">
        <div>
            <input data-id="{{ $notification->id }}" class="toggle-class-noti d-none sts_chnage"
                type="checkbox" data-toggle="toggle" data-on="Read" data-off="Unread"
                data-onstyle="success" data-offstyle="danger" data-size="mini"
                {{ $notification->read_status ? 'checked' : '' }}>
        </div>
    </td>
    <td data-label="Action" class="text-right">
        <div class="actions-cell">
            <a href="javascript:void(0)" noti_id="{{ $notification->id }}" class="action-icon-btn delete delete-notification cursor-pointer" title="Delete Permanently">
                <i class="bi bi-trash3-fill"></i>
            </a>
        </div>
    </td>
</tr>
@endforeach
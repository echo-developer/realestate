@foreach ($all_settings as $items)
                                    <tr>
                                        <td>{{ $items->title }}</td>
                                        <td>{{ $items->setting_key }}</td>
                                        <td style="width:40%;word-break: break-all;">{{ $items->setting_key }}
                                        </td>
                                        <td class="text-right" style="padding-right:15px;">

                                            {{-- @if (in_array('MEN0051_LIST_Edit', $rolePermissions)) --}}
                                            @if ($items->editable != 0)
                                                <a data-toggle="tooltip" title="" class="allSettingsEditButton"
                                                    data-placement="top" data-original-title="Edit"
                                                    setting-id="{{ $items->id }}"><i
                                                        class="fa fa-edit text-success fa-md"></i></a>
                                                &nbsp;
                                            @endif
                                            {{-- @endif --}}
                                            {{-- @if (in_array('MEN0051_LIST_Edit', $rolePermissions)) --}}
                                            @if ($items->deletable != 0)
                                                <a data-toggle="tooltip" title="" class="allSettingsDeleteButton"
                                                    data-placement="top" data-original-title="De"
                                                    setting-id="{{ $items->id }}"><i
                                                        class="fa fa-trash text-danger fa-md"></i></a>
                                                &nbsp;
                                            @endif
                                            {{-- @endif --}}
                                        </td>
                                    </tr>
                                @endforeach

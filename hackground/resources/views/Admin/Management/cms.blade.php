@extends('Admin.layouts.app')

@section('content')
    <div class="body-page-loader d-none">
        <div class="loader">
            <div class="line-scale-pulse-out">
                <div class="bg-warning"></div>
                <div class="bg-warning"></div>
                <div class="bg-warning"></div>
                <div class="bg-warning"></div>
                <div class="bg-warning"></div>
            </div>
        </div>
    </div>

    <div class="app-main__inner">

        <div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon">
                        <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
                    </div>
                    <div>CMS
                        <div class="page-title-subheading">Management &gt; CMS List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">CMS List</li>
                    </ol>
                </div>
            </div>
        </div>
        <div id="successMessageContainer"></div>
        <style>
            /* Modern Card Styling */
            .main-card { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); background: #fff; overflow: hidden; }
            .card-header { background: #f8fafc; border-bottom: 1px solid #f1f5f9; padding: 1.25rem 1.5rem; font-size: 1.1rem; font-weight: 700; color: #1e293b; display: flex; justify-content: space-between; align-items: center; }
            .card-body { padding: 0; }
            
            /* Premium Form Controls */
            .form-control, .form-select { border-radius: 8px; border: 1px solid #cbd5e1; padding: 0.65rem 0.85rem; transition: all 0.2s; box-shadow: none; font-size: 0.95rem; }
            .form-control:focus, .form-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); z-index: 5; }
            .premium-label { font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 0.4rem; display: block; }
            
            /* CKEditor Styling Override */
            .cke_chrome { border-radius: 8px !important; border: 1px solid #cbd5e1 !important; box-shadow: none !important; overflow: hidden; }
            .cke_top { border-bottom: 1px solid #e2e8f0 !important; background: #f8fafc !important; }
            
            /* Modern Tabs (Pills) */
            .nav-pills-custom { background: #f1f5f9; padding: 0.35rem; border-radius: 10px; display: inline-flex; gap: 0.25rem; }
            .nav-pills-custom .nav-item { flex: 1; text-align: center; }
            .nav-pills-custom .nav-link { border-radius: 8px; color: #64748b; font-weight: 600; padding: 0.5rem 1.5rem; transition: all 0.2s; border: none; background: transparent; }
            .nav-pills-custom .nav-link:hover { color: #3b82f6; background: rgba(255,255,255,0.5); }
            .nav-pills-custom .nav-link.active { background: #fff; color: #1e293b; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
            
            /* Custom Section Box */
            .premium-section-box { background: #f8fafc; border: none; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
            
            /* Radio Button Replacements */
            .premium-radio-group { display: flex; gap: 1rem; align-items: center; }
            .premium-radio-group .form-check { padding-left: 0; margin-bottom: 0; }
            .premium-radio-group .form-check-input { display: none; }
            .premium-radio-group .form-check-label { cursor: pointer; display: inline-flex; align-items: center; padding: 0.4rem 1.25rem; border-radius: 50px; font-size: 0.9rem; font-weight: 600; border: 1px solid #cbd5e1; background: #fff; color: #64748b; transition: all 0.2s; user-select: none; }
            .premium-radio-group .form-check-input:checked + .form-check-label { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15); }
            
            /* Table Modernization */
            .table-responsive { margin: 0; }
            .table { margin-bottom: 0; }
            .table thead th { background: #f8fafc; color: #64748b; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding: 1rem 1.5rem; border-top: none; }
            .table tbody td { padding: 1.25rem 1.5rem; vertical-align: middle; color: #334155; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; }
            .table tbody tr:hover { background-color: #f8fafc; }
            .table tbody tr:last-child td { border-bottom: none; }
            
            /* Search Panel */
            .advance-search-panel { background-color: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); padding: 1.25rem; margin-top: 1rem; border: none; }
            
            /* Action Buttons */
            .action-btn-group { display: flex; gap: 0.5rem; justify-content: flex-end; }
            .btn-action { width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.2s; border: 1px solid transparent; background: transparent; }
            .btn-action-edit { color: #3b82f6; border-color: #bfdbfe; background: #eff6ff; }
            .btn-action-edit:hover { background: #3b82f6; color: #fff; border-color: #3b82f6; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(59,130,246,0.2); }
            .btn-action-delete { color: #ef4444; border-color: #fecaca; background: #fef2f2; }
            .btn-action-delete:hover { background: #ef4444; color: #fff; border-color: #ef4444; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(239,68,68,0.2); }
            .btn-add-premium { border-radius: 8px; padding: 0.6rem 1.25rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
            .btn-add-premium:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25); }

            /* Status Pills (Custom Toggle) */
            .status-pill { cursor: pointer; display: inline-flex; align-items: center; padding: 0.35rem 1rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid transparent; user-select: none; }
            .status-pill-active { background-color: #dcfce7; color: #166534; border-color: #bbf7d0; box-shadow: 0 2px 5px rgba(22, 101, 52, 0.1); }
            .status-pill-active::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #16a34a; margin-right: 6px; box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2); }
            .status-pill-active:hover { background-color: #bbf7d0; transform: translateY(-1px); }
            .status-pill-inactive { background-color: #fee2e2; color: #991b1b; border-color: #fecaca; }
            .status-pill-inactive::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #dc2626; margin-right: 6px; }
            .status-pill-inactive:hover { background-color: #fecaca; transform: translateY(-1px); }

            /* Responsive Card Layout for Mobile */
            @media (max-width: 768px) {
                .table thead { display: none; }
                .table tbody tr { display: block; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 1rem; padding: 1rem; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
                .table tbody td { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px dashed #f1f5f9; }
                .table tbody td:last-child { border-bottom: none; padding-bottom: 0; justify-content: flex-end; margin-top: 0.5rem; }
                .table tbody td::before { content: attr(data-label); font-weight: 600; color: #64748b; font-size: 0.85rem; text-transform: uppercase; margin-right: 1rem; }
                .action-btn-group { width: 100%; justify-content: flex-end; }
            }
        </style>
        @if (session('success_msg'))
            <div class="alert alert-{{ session('message_type') }}">
                {{ session('success_msg') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert">

                </button>
            </div>
        @endif

        <div id="cms_list_view">
        <form action="{{ url('management/cms') }}" method="get">
            <section class="content-header mb-2">
                <div class="row justify-content-end">
                    <div class="col-xl-4 col-lg-6">
                        <div class="input-group">
                            <input class="form-control border-end-0" id="prop_cms_search" placeholder="Search CMS..." name="term" value="{{ request('term') }}" style="border-radius: 8px 0 0 8px;" />
                            <button type="submit" class="btn btn-primary" style="border-radius: 0 8px 8px 0; padding-left: 1.25rem; padding-right: 1.25rem;">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </form>

        <div class="main-card mb-3 card">
            <div class="card-header d-flex">
                <h4 class="mb-0">CMS List</h4>
                <div class="btn-actions-pane-right">
                    <button type="button" class="btn btn-primary btn-add-premium" onclick="add_prop_cms()">
                        <i class="bi bi-plus-lg"></i> Add CMS
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive" id="main_table">
                    <table class="mb-0 table" id="email-table">
                        <thead>
                            <tr>
                                <th style="width: 32px;">ID</th>
                                <th>Title</th>
                                <th>Key</th>
                                <th>Order</th>
                                <th>Status</th>
                                <th style="min-width:120px;" class="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody id="user">
                            @forelse($data as $item)
                                <tr>
                                    <td data-label="ID" class="text-muted fw-bold">#{{ $item->id }}</td>
                                    <td data-label="Title" class="fw-semibold text-dark">{{ $item->title }}</td>
                                    <td data-label="Key"><code class="bg-light px-2 py-1 rounded text-primary">{{ $item->slug }}</code></td>
                                    <td data-label="Order"><span class="badge bg-secondary rounded-pill px-3">{{ $item->order }}</span></td>
                                    <td data-label="Status">
                                        <div class="status-pill cms_prop_status_pill {{ $item->status ? 'status-pill-active' : 'status-pill-inactive' }}" 
                                             data-id="{{ $item->id }}" 
                                             data-status="{{ $item->status }}">
                                            {{ $item->status ? 'Active' : 'Inactive' }}
                                        </div>
                                        <input type="checkbox" class="cms_prop_status d-none" data-id="{{ $item->id }}" {{ $item->status ? 'checked' : '' }}>
                                    </td>
                                    <td data-label="Action" class="text-end">
                                        <div class="action-btn-group">
                                            <button type="button" class="btn-action btn-action-edit" onclick="Edit_prop_cms('{{ $item->id }}')" title="Edit">
                                                <i class="bi bi-pencil-square"></i>
                                            </button>
                                            <button type="button" class="btn-action btn-action-delete" onclick="Delete_prop_cms('{{ $item->id }}')" title="Delete">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="text-center py-5">
                                        <div class="text-muted d-flex flex-column align-items-center">
                                            <i class="bi bi-inbox fs-1 mb-2"></i>
                                            <span>Sorry, no records found!</span>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>

                    </table>
                </div>
                {!! $data->links('vendor.pagination.bootstrap-5') !!}
            </div>
        </div>
        </div> <!-- End cms_list_view -->
        
        <!-- INLINE FULL PAGE FORM -->
        <div class="main-card mb-3 card" id="cms_form_view" style="display: none;">
            <div class="card-header d-flex">
                <h4 class="mb-0" id="prop_cmsAddEditModalLabel">Add CMS</h4>
                <div class="btn-actions-pane-right">
                    <button type="button" class="btn btn-light border px-4 fw-semibold" onclick="close_cms_form()">
                        <i class="bi bi-arrow-left me-2"></i>Back to List
                    </button>
                </div>
            </div>
            <div class="card-body p-4">
                <form id="prop_cmsformData">
                    <input type="hidden" class='d-none' id="prop_cmsimage" name="image">
                    <input type="text" class='d-none' id="prop_cmsId" name="prop_cmsId">
                    
                    <div class="premium-section-box">
                            <h6 class="fw-bold mb-3 text-primary"><i class="bi bi-info-circle me-2"></i>General Information</h6>
                            
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label for="slug" class="premium-label">Slug (Unique Key)</label>
                                    <input type="text" class="form-control reset_field bg-white" id="slug" name="slug" placeholder="e.g. about-us" autocomplete="off">
                                    <div class="invalid-feedback" id="slug_error"></div>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label for="order" class="premium-label">Display Order</label>
                                    <input type="number" class="form-control bg-white" id="order" name="order" placeholder="0" required>
                                    <div class="invalid-feedback" id="order_error"></div>
                                </div>
                                <div class="col-md-5 mb-3">
                                    <label class="premium-label">Status</label>
                                    <div class="premium-radio-group">
                                        <div class="form-check">
                                            <input type="radio" name="status" value="1" class="form-check-input" id="status_1" checked required>
                                            <label class="form-check-label" for="status_1"><i class="bi bi-check-circle me-1"></i> Active</label>
                                        </div>
                                        <div class="form-check">
                                            <input type="radio" name="status" value="0" class="form-check-input" id="status_2">
                                            <label class="form-check-label" for="status_2"><i class="bi bi-x-circle me-1"></i> Inactive</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        @php
                            $langs = explode(',', admin_default_lang());
                        @endphp
                        
                        <!-- Language Specific Content Tabs -->
                        <div class="d-flex justify-content-center mb-4">
                            <ul class="nav nav-pills-custom" id="langTabs" role="tablist">
                                @foreach ($langs as $index => $lang)
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link {{ $index === 0 ? 'active' : '' }} text-uppercase" id="tab-{{ $lang }}" data-bs-toggle="pill" data-bs-target="#content-{{ $lang }}" type="button" role="tab">
                                            {{ $lang }}
                                        </button>
                                    </li>
                                @endforeach
                            </ul>
                        </div>

                        <div class="tab-content" id="langTabsContent">
                            @foreach ($langs as $index => $lang)
                                <div class="tab-pane fade {{ $index === 0 ? 'show active' : '' }}" id="content-{{ $lang }}" role="tabpanel">
                                    <div class="mb-3">
                                        <label for="title_{{ $lang }}" class="premium-label">{{ __('Title') }} ({{ strtoupper($lang) }})</label>
                                        <input type="text" class="form-control reset_field" id="title_{{ $lang }}" name="title[{{ $lang }}]" placeholder="Enter title..." autocomplete="off">
                                        <div class="invalid-feedback" id="title_{{ $lang }}_error"></div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="content_{{ $lang }}" class="premium-label">{{ __('Content') }} ({{ strtoupper($lang) }})</label>
                                        <textarea class="form-control reset_field" id="content_{{ $lang }}" name="content[{{ $lang }}]"></textarea>
                                        <div class="invalid-feedback" id="content_{{ $lang }}_error"></div>
                                    </div>
                                    
                                    <div class="border-top pt-3 mt-4">
                                        <h6 class="fw-bold mb-3 text-secondary"><i class="bi bi-search me-2"></i>SEO Meta Data ({{ strtoupper($lang) }})</h6>
                                        <div class="mb-3">
                                            <label for="meta_title_{{ $lang }}" class="premium-label">{{ __('Meta Title') }}</label>
                                            <input type="text" class="form-control reset_field" id="meta_title_{{ $lang }}" name="meta_title[{{ $lang }}]" placeholder="SEO Title" autocomplete="off">
                                            <div class="invalid-feedback" id="meta_title_{{ $lang }}_error"></div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="meta_keys_{{ $lang }}" class="premium-label">{{ __('Meta Keywords') }}</label>
                                            <input type="text" class="form-control reset_field" id="meta_keys_{{ $lang }}" name="meta_keys[{{ $lang }}]" placeholder="keyword1, keyword2..." autocomplete="off">
                                            <div class="invalid-feedback" id="meta_keys_{{ $lang }}_error"></div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="meta_desc_{{ $lang }}" class="premium-label">{{ __('Meta Description') }}</label>
                                            <textarea class="form-control reset_field" id="meta_desc_{{ $lang }}" name="meta_desc[{{ $lang }}]" placeholder="SEO Description..." autocomplete="off" style="min-height: 80px;"></textarea>
                                            <div class="invalid-feedback" id="meta_desc_{{ $lang }}_error"></div>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    
                    <div class="border-top pt-4 mt-4 d-flex justify-content-end">
                        <button type="button" class="btn btn-light border px-4 fw-semibold me-2" onclick="close_cms_form()">Cancel</button>
                        <button type="button" onclick="add_edit_prop_cms()" id="prop_cmsButton" class="btn btn-primary px-5 fw-bold shadow-sm">Save</button>
                    </div>
                </form>
            </div>
        </div>
        
    </div>
@endsection
@push('custom-js')
    <script>
        const langs = @json($langs);
        langs.forEach(lang => {
            CKEDITOR.replace(`content_${lang}`);
        });


        function add_prop_cms() {
            const langs = @json($langs); // Pass $langs from backend as JSON
            langs.forEach(lang => {
                const editorInstance = CKEDITOR.instances[`content_${lang}`];
                if (editorInstance) {
                    editorInstance.setData(''); // Clear the CKEditor content
                }
            });
            $('.form-control').removeClass('is-invalid');
            $('#slug').prop('readonly', false);
            $('.invalid-feedback').empty();
            prop_cmsAddEdit('Add CMS', 'Save');
        }
        
        function close_cms_form() {
            $('#cms_form_view').hide();
            $('#cms_list_view').fadeIn();
            window.scrollTo(0, 0);
        }

        function Edit_prop_cms(id) {
            console.log(id);
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            prop_cmsAddEdit('Edit CMS', 'Update', id);
        }

        function prop_cmsAddEdit(title, buttonText, id = null) {
            $('#prop_cmsAddEditModalLabel').text(title);
            $('#prop_cmsButton').text(buttonText);
            $('#prop_cmsformData')[0].reset();
            $('#image_preview').attr('src', '').hide();
            $('#delete_image_btn').hide();
            if (id) {
                $.get(`{{ url('/management/cms-details') }}/${id}`, function(data) {
                    $('#prop_cmsId').val(data[0].cms_id);
                    data.forEach(function(cms) {
                        $('#title_' + cms.lang).val(cms.title);
                        $('#meta_desc_' + cms.lang).val(cms.meta_desc);
                        $('#meta_title_' + cms.lang).val(cms.meta_title);
                        $('#meta_keys_' + cms.lang).val(cms.meta_keys);


                        const editorInstance = CKEDITOR.instances['content_' + cms.lang];
                        if (editorInstance) {
                            editorInstance.setData(cms
                                .content); // Use CKEditor's method to set data
                        } else {
                            $('#content_' + cms.lang).val(cms
                                .content); // Fallback in case CKEditor is not initialized
                        }


                        if (cms.lang === 'en') {
                            $('#slug').val(cms.slug).prop('readonly', true);
                            $('#order').val(cms.order);
                            $('input[name="status"][value="' + cms.status + '"]').prop(
                                'checked', true);
                        }
                    });
                });
            }
            
            // SPA Transition
            $('#cms_list_view').hide();
            $('#cms_form_view').fadeIn();
            window.scrollTo(0, 0);
        }

        function add_edit_prop_cms() {

            for (let instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].updateElement(); // This updates the textarea with CKEditor content
            }

            var data = $("#prop_cmsformData").serializeArray();
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            var url = $('#prop_cmsId').val() ?
                `{{ url('/management/edit-management-cms') }}` :
                `{{ url('/management/add-management-cms') }}`;

            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(response) {
                    // localStorage.setItem('successMessage', response.message);
                    window.location.reload(true);
                    close_cms_form();
                    $('#prop_cmsformData')[0].reset();
                },
                error: function(response) {
                    var errors = response.responseJSON.errors;

                    // Reset previous error messages and invalid class
                    $('.invalid-feedback').text('').hide();
                    $('.form-control').removeClass('is-invalid');

                    // Loop through errors and update the DOM
                    Object.entries(errors).forEach(([field, messages]) => {
                        const fieldId = field.replace('.', '_'); // Convert 'name.en' to 'name_en'
                        const inputSelector = `#${fieldId}`;
                        const errorSelector = `#${fieldId}_error`;

                        $(inputSelector).addClass('is-invalid');
                        $(errorSelector).text(messages[0]).show();
                    });

                }

            });
        }

        $('.cms_prop_status_pill').click(function() {
            var $pill = $(this);
            var id = $pill.data('id');
            var currentStatus = $pill.data('status');
            var newStatus = currentStatus ? 0 : 1;
            
            // Immediately update UI for snappy feedback
            $pill.data('status', newStatus);
            if(newStatus) {
                $pill.removeClass('status-pill-inactive').addClass('status-pill-active').text('Active');
            } else {
                $pill.removeClass('status-pill-active').addClass('status-pill-inactive').text('Inactive');
            }
            
            toastr.success('Status updated successfully.', 'Success', {timeOut: 2000});

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: 'POST',
                url: `{{ url('management/cms_status') }}`,
                data: {
                    'status': newStatus,
                    'id': id
                },
                success: function(data) {
                    // handled proactively
                },
                error: function(msg) {
                    console.log(msg);
                    // Revert on error
                    $pill.data('status', currentStatus);
                    if(currentStatus) {
                        $pill.removeClass('status-pill-inactive').addClass('status-pill-active').text('Active');
                    } else {
                        $pill.removeClass('status-pill-active').addClass('status-pill-inactive').text('Inactive');
                    }
                    toastr.error('Failed to update status.');
                }
            });
        });

        function Delete_prop_cms(id) {
            var result = confirm('Are you sure you want to delete this?');
            console.log(id);
            if (result) {
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                $.ajax({
                    type: 'POST',
                    url: `{{ url('management/cms-delete') }}`,
                    data: {
                        'id': id
                    },
                    success: function(response) {
                        // localStorage.setItem('successMessage', response.message);
                        window.location.reload(true);
                    },
                    error: function(msg) {
                        console.log(msg);
                        var errors = msg.responseJSON;
                    }
                });
            }
        }
    </script>
@endpush

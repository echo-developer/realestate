<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>New Admin | Log in</title>
    <meta name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />

    <!-- Disable tap highlight on IE -->
    <meta name="msapplication-tap-highlight" content="no">

    <link rel="stylesheet" href="{{ asset('assets/css/base.min.css') }}">

</head>

<body>
    <div class="app-container app-theme-white body-tabs-shadow">
        <div class="app-container">
            <div class="h-100 bg-plum-plate bg-animation">
                <div class="d-flex h-100 justify-content-center align-items-center">
                    <div class="mx-auto app-login-box col-md-8">
                        <div class="app-logo-inverse mx-auto mb-3"></div>
                        <div class="modal-dialog w-100 mx-auto">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div class="h5 modal-title text-center">
                                        <h4 class="mt-2">
                                            <div>Reset Password</div>
                                            <span>Please enter your email below.</span>
                                        </h4>
                                    </div>
                                    <form action="{{ url('sendResetLink') }}" method="POST" id="reset_pass_Form">
                                        @csrf
                                        <div class="form-row">
                                            <div class="col-md-12">
                                                <div class="position-relative form-group">
                                                    <input name="email" id="email" placeholder="Email here..."
                                                        type="email" class="form-control">
                                                    {{-- @if (session('status'))
                                                        <div class="alert alert-success">
                                                            <p id="emailError" style="color: rgb(255, 255, 255)">
                                                                {{ session('status') }}</p>
                                                        </div>
                                                    @endif --}}
                                                </div>
                                            </div>
                                        </div>


                                </div>
                                <div class="modal-footer clearfix">
                                    <div class="float-right">
                                        <button onclick="login()" class="btn btn-primary btn-lg">Send Reset
                                            Link</button>
                                    </div>
                                </div>
                            </div>
                            </form>
                        </div>

                        <div class="text-center text-white opacity-8 mt-3">Copyright © ArchitectUI 2019</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script></script>

</html>

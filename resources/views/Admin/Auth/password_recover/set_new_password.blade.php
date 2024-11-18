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
                                            <span>Set your New Password.</span>
                                        </h4>
                                    </div>
                                    @if (session('error'))
                                        <div class="alert alert-danger">
                                            {{ session('error') }}
                                        </div>
                                    @endif

                                    <!-- Password Reset Form -->
                                    <form action="{{ url('/saveNewPass') }}" method="POST">
                                        @csrf
                                        <input type="hidden" name="token" value="{{ $token }}">
                                        <div class="form-group @error('email') is-invalid @enderror">
                                            <input type="email" name="email" class="form-control"
                                                value="{{ old('email') }}" placeholder="Enter your email">

                                            @error('email')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>


                                        <div class="form-group @error('password') is-invalid @enderror">
                                            <input type="password" name="password" class="form-control"
                                                placeholder="New password">

                                            @error('password')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>


                                        <div class="form-group @error('password_confirmation') is-invalid @enderror">
                                            <input type="password" name="password_confirmation" class="form-control"
                                                placeholder="Confirm new password">
                                        </div>

                                </div>
                                <div class="modal-footer clearfix">
                                    <div class="float-right">
                                        <button type="submit" class="btn btn-primary btn-lg">Reset Password</button>
                                    </div>
                                </div>
                                </form>
                                @if ($errors->any())
                                    <div class="alert alert-danger">
                                        <ul>
                                            @foreach ($errors->all() as $error)
                                                <li>{{ $error }}</li>
                                            @endforeach
                                        </ul>
                                    </div>
                                @endif
                            </div>
                        </div>

                        <div class="text-center text-white opacity-8 mt-3">Copyright © ArchitectUI 2019</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- JS Libraries -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</body>

</html>

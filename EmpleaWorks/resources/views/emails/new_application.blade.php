<!-- resources/views/emails/new_application.blade.php -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>{{ __('messages.new_application_received') }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
        }

        .container {
            padding: 20px;
        }

        .header {
            background-color: #4F46E5;
            color: white;
            padding: 15px;
            text-align: center;
        }

        .content {
            padding: 20px;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }

        .candidate-info {
            background-color: #f9f9f9;
            border-left: 4px solid #4F46E5;
            padding: 15px;
            margin: 15px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>{{ __('messages.new_application_received') }}</h1>
        </div>
        <div class="content">
            <p>{{ __('messages.hello_company', ['name_app' => $company->name]) }}</p>

            <p>{{ __('messages.new_application_message') }} <strong>{{ $offer->name }}</strong>.</p>

            <div class="candidate-info">
                <h3>{{ __('messages.candidate_information') }}</h3>
                <p><strong>{{ __('messages.name') }}:</strong> {{ $candidate->name }}</p>
                <p><strong>{{ __('messages.phone') }}:</strong> {{ $phone }}</p>
                <p><strong>{{ __('messages.email') }}:</strong> {{ $email }}</p>
                <p><strong>{{ __('messages.cover_letter') }}:</strong></p>
                <p>{{ $coverLetter }}</p>
            </div>

            <p>{{ __('messages.review_candidate_profile') }}</p>

            <p>{{ __('messages.regards') }},<br>
                {{ __('messages.emplea_works_team') }}</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} EmpleaWorks. {{ __('messages.all_rights_reserved') }}
        </div>
    </div>
</body>

</html>
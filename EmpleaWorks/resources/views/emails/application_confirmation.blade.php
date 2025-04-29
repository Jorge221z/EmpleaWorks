<!-- resources/views/emails/application_confirmation.blade.php -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>{{ __('messages.application_sent') }}</title>
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
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>{{ __('messages.application_sent') }}</h1>
        </div>
        <div class="content">
            <p>{{ __('messages.hello_candidate', ['name_app' => $candidate->name]) }}</p>

            <p>{!! __('messages.application_confirmation_message', ['offer' => $offer->name, 'company' => $company->name]) !!}</p>

            <h3>{{ __('messages.application_details') }}:</h3>
            <ul>
                <li><strong>{{ __('messages.phone') }}:</strong> {{ $phone }}</li>
                <li><strong>{{ __('messages.email') }}:</strong> {{ $email }}</li>
                <li><strong>{{ __('messages.cover_letter') }}:</strong> {{ $coverLetter }}</li>
            </ul>

            <p>{{ __('messages.company_review_message') }}</p>

            <p>{{ __('messages.regards') }},<br>
                {{ __('messages.emplea_works_team') }}</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} EmpleaWorks. {{ __('messages.all_rights_reserved') }}
        </div>
    </div>
</body>

</html>


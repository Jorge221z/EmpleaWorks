<!-- resources/views/emails/application_confirmation.blade.php -->
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('messages.application_sent') }}</title>
</head>

<body
    style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333; background-color: #f0f0f0; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f0f0;">
        <tr>
            <td align="center" style="padding: 20px;">
                <div
                    style="max-width: 600px; background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                    <!-- Header -->
                    <div
                        style="background-color: #3730A3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <div style="background: #fff; border-radius: 6px; padding: 10px 0; margin-bottom: 10px; text-align: center;">
                            <img src="{{ $logo }}" alt="EmpleaWorks Logo" style="height: 100px; display: inline-block;">
                        </div>
                        <h1 style="color: #fffff font-size: 28px; margin: 0;">{{ __('messages.application_sent') }}</h1>
                        <p style="font-size: 16px; margin: 10px 0 0;">{{ $offer->name }} {{ __('messages.template_subject') }} {{ $company->name }}</p>
                    </div>
                    <!-- Content -->
                    <div style="padding: 30px; font-size: 16px;">
                        <p>{{ __('messages.hello_candidate', ['name_app' => $candidate->name]) }}</p>
                        <p>{!! __('messages.application_confirmation_message', ['offer' => $offer->name, 'company' => $company->name]) !!}
                        </p>
                        <h3 style="font-size: 20px; color: #3730A3; margin-top: 30px;">
                            {{ __('messages.application_details') }}:</h3>
                        <table
                            style="width: 100%; border: 1px solid #ddd; border-collapse: collapse; margin-top: 10px;">
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong
                                        style="color: #3730A3;">{{ __('messages.phone') }}:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">{{ $phone }}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong
                                        style="color: #3730A3;">{{ __('messages.email') }}:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">{{ $email }}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong
                                        style="color: #3730A3;">{{ __('messages.cover_letter') }}:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">{{ $coverLetter }}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong
                                        style="color: #3730A3;">{{ __('messages.cv') }}:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">
                                    @if(isset($cvPath) && $cvPath)
                                        <a href="{{ $cvUrl }}" style="color: #4F46E5; text-decoration: underline;" target="_blank">
                                            {{ __('messages.your_cv') }}
                                        </a>
                                    @else
                                        {{ __('messages.no_cv_uploaded') }}
                                    @endif
                                </td>
                            </tr>
                        </table>
                        <p style="margin-top: 20px;">{{ __('messages.company_review_message') }}</p>
                        <!-- Call-to-Action -->
                        <p style="margin-top: 30px; text-align: center;">
                            <a href="http://localhost/candidate/dashboard"
                                style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Ver
                                Estado de la Solicitud</a>
                        </p>
                        <p style="margin-top: 30px;">{{ __('messages.regards') }},<br>
                            {{ __('messages.emplea_works_team') }}</p>
                    </div>
                    <!-- Footer -->
                    <div
                        style="text-align: center; margin-top: 20px; font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
                        © {{ date('Y') }} EmpleaWorks. {{ __('messages.all_rights_reserved') }}
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>

</html>

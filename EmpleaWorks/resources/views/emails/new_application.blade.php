<!-- resources/views/emails/new_application.blade.php -->
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('messages.new_application_received') }}</title>
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
                        style="background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="font-size: 28px; margin: 0;">{{ __('messages.new_application_received') }}</h1>
                        <p style="font-size: 16px; margin: 10px 0 0;">{{ __('messages.for_the_offer') }} {{ $offer->name }}</p>
                    </div>
                    <!-- Content -->
                    <div style="padding: 30px; font-size: 16px;">
                        <p>{{ __('messages.hello_company', ['name_app' => $company->name]) }}</p>
                        <p>{{ __('messages.new_application_message') }} <strong>{{ $offer->name }}</strong>.</p>
                        <!-- Candidate Information -->
                        <div
                            style="background-color: #f9f9f9; border-left: 4px solid #4F46E5; padding: 20px; margin: 20px 0; border-radius: 5px;">
                            <h3 style="font-size: 20px; color: #4F46E5; margin-top: 0;">
                                {{ __('messages.candidate_information') }}</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px; vertical-align: top; width: 30%;"><strong
                                            style="color: #4F46E5;">{{ __('messages.name') }}:</strong></td>
                                    <td style="padding: 8px; vertical-align: top;">{{ $candidate->name }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; vertical-align: top;"><strong
                                            style="color: #4F46E5;">{{ __('messages.phone') }}:</strong></td>
                                    <td style="padding: 8px; vertical-align: top;">{{ $phone }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; vertical-align: top;"><strong
                                            style="color: #4F46E5;">{{ __('messages.email') }}:</strong></td>
                                    <td style="padding: 8px; vertical-align: top;">{{ $email }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; vertical-align: top;"><strong
                                            style="color: #4F46E5;">{{ __('messages.cover_letter') }}:</strong></td>
                                    <td style="padding: 8px; vertical-align: top;">{{ $coverLetter }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; vertical-align: top;"><strong
                                            style="color: #4F46E5;">{{ __('messages.cv') }}:</strong></td>
                                    <td style="padding: 8px; vertical-align: top;">
                                        @if(isset($cvPath) && $cvPath)
                                            <a href="{{ $cvUrl }}" style="color: #4F46E5; text-decoration: underline;" target="_blank">
                                                {{ __('messages.download_cv') }}
                                            </a>
                                        @else
                                            {{ __('messages.no_cv_available') }}
                                        @endif
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <p>{{ __('messages.review_candidate_profile') }}</p>
                        <!-- Call-to-Action -->
                        <p style="margin-top: 30px; text-align: center;">
                            <a href="#"
                                style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">{{ __('messages.view_candidate_profile') }}</a>
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
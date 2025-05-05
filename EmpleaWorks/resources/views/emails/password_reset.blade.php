<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('messages.reset_password_email_title') }}</title>
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
                            <img src="https://emplea.works/images/logo.png" alt="EmpleaWorks Logo" style="height: 100px; display: inline-block;">
                        </div>
                        <h1 style="font-size: 28px; margin: 0;">{{ __('messages.reset_password_email_title') }}</h1>
                    </div>
                    <!-- Content -->
                    <div style="padding: 30px; font-size: 16px;">
                        <p>{{ __('messages.hello', ['name' => $name]) }}</p>
                        <p>{{ __('messages.reset_password_request') }}</p>
                        <!-- Call-to-Action Button -->
                        <p style="text-align: center; margin: 30px 0;">
                            <a href="{{ $resetUrl }}"
                                style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">{{ __('messages.reset_password_button') }}</a>
                        </p>
                        <p>{!! __('messages.reset_link_expire', ['minutes' => $expires]) !!}</p>
                        <p>{{ __('messages.reset_not_requested') }}</p>
                        <p style="margin-top: 30px;">{{ __('messages.email_greeting') }}<br>{{ __('messages.email_team') }}</p>
                    </div>
                    <!-- Footer -->
                    <div
                        style="text-align: center; margin-top: 20px; font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
                        {!! __('messages.email_rights', ['year' => date('Y')]) !!}
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>

</html>
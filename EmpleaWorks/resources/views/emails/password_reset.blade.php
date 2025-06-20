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
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #3730A3; border-radius: 8px 8px 0 0;">
                        <tr>
                            <td style="padding: 20px; text-align: center;">
                                <!-- Logo Container -->
                                <table width="120" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 6px; margin: 0 auto 15px auto;">
                                    <tr>
                                        <td style="padding: 10px; text-align: center;">
                                            <img src="http://emplea.works/images/logo.webp" 
                                                 alt="EmpleaWorks Logo" 
                                                 width="100" 
                                                 height="100" 
                                                 style="width: 100px; height: 100px; max-width: 100px; max-height: 100px; border: 0; display: block; margin: 0 auto;">
                                        </td>
                                    </tr>
                                </table>
                                <!-- Title -->
                                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: bold;">{{ __('messages.reset_password_email_title') }}</h1>
                            </td>
                        </tr>
                    </table>
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
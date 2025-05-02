<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} - {{ $level === 'error' ? __('messages.error') : __('messages.notification') }}
    </title>
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
                        style="background-color: {{ $level === 'error' ? '#EF4444' : ($level === 'success' ? '#10B981' : '#3730A3') }}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="font-size: 28px; margin: 0; color: white; text-align: center;">
                            {{ !empty($greeting) ? $greeting : ($level === 'error' ? __('messages.ups') : __('messages.hello_check_email')) }}
                        </h1>
                    </div>
                    <!-- Content -->
                    <div style="padding: 30px; font-size: 16px;">
                        <!-- Intro Lines -->
                        @foreach ($introLines as $line)
                            <p>{{ __('messages.verify_p') }}</p>
                        @endforeach
                        <!-- Action Button -->
                        @isset($actionText)
                                                <?php
    $color = match ($level) {
        'success' => '#10B981',
        'error' => '#EF4444',
        default => '#4F46E5',
    };
                                                                            ?>
                                                <p style="text-align: center; margin: 30px 0;">
                                                    <a href="{{ $actionUrl }}"
                                                        style="background-color: {{ $color }}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                                        {{ __('messages.verify_button') }}
                                                    </a>
                                                </p>
                        @endisset
                        <!-- Outro Lines -->
                        @foreach ($outroLines as $line)
                            <p>{{ __('messages.verify_e') }}</p>
                        @endforeach
                        <!-- Salutation -->
                        <p style="margin-top: 30px;">
                            {{ !empty($salutation) ? $salutation : __('messages.regards_mail') }}<br>
                            {{ config('app.name') }}
                        </p>
                    </div>
                    <!-- Subcopy (if action button is present) -->
                    @isset($actionText)
                        <div
                            style="text-align: center; margin-top: 20px; font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
                            {{ __('messages.button_trouble', ['actionText' => __('messages.verify_button')]) }}<br>
                            <a href="{{ $actionUrl }}"
                                style="color: #4F46E5; text-decoration: none;">{{ $displayableActionUrl }}</a>
                        </div>
                    @endisset
                    <!-- Footer -->
                    <div
                        style="text-align: center; margin-top: 20px; font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
                        © {{ date('Y') }} {{ config('app.name') }}. {{ __('messages.all_rights_reserved') }}
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>

</html>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <title>Restablece tu contraseña</title>
</head>

<body>
    <p>Hola {{ $name }},</p>
    <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para establecer una
        nueva:</p>
    <p><a href="{{ $resetUrl }}">{{ $resetUrl }}</a></p>
    <p>Este enlace expirará en <strong>{{ $expires }} minutos</strong>.</p>
    <p>Si no has solicitado este cambio, simplemente ignora este correo.</p>
    <hr>
    <p>Saludos,<br>El equipo de TuApp</p>
</body>

</html>
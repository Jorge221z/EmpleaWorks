<!-- resources/views/emails/application_confirmation.blade.php -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Solicitud Confirmada</title>
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
            <h1>Solicitud Enviada</h1>
        </div>
        <div class="content">
            <p>Hola {{ $user->name }},</p>

            <p>Tu solicitud para el puesto <strong>{{ $offer->name }}</strong> en <strong>{{ $company->name }}</strong>
                ha sido enviada correctamente.</p>

            <h3>Detalles de tu solicitud:</h3>
            <ul>
                <li><strong>Teléfono:</strong> {{ $phone }}</li>
                <li><strong>Email:</strong> {{ $email }}</li>
                <li><strong>Carta de presentación:</strong> {{ $coverLetter }}</li>
            </ul>

            <p>La empresa revisará tu perfil y se pondrá en contacto contigo si estiman que tu perfil es adecuado para
                el puesto.</p>

            <p>Saludos,<br>
                El equipo de EmpleaWorks</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} EmpleaWorks. Todos los derechos reservados.
        </div>
    </div>
</body>

</html>


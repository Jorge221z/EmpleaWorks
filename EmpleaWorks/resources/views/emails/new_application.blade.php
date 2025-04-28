<!-- resources/views/emails/new_application.blade.php -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Nueva Solicitud</title>
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
            <h1>Nueva Solicitud Recibida</h1>
        </div>
        <div class="content">
            <p>Hola {{ $company->name }},</p>

            <p>Has recibido una nueva solicitud para el puesto <strong>{{ $offer->name }}</strong>.</p>

            <div class="candidate-info">
                <h3>Información del candidato:</h3>
                <p><strong>Nombre:</strong> {{ $candidate->name }}</p>
                <p><strong>Teléfono:</strong> {{ $phone }}</p>
                <p><strong>Email:</strong> {{ $email }}</p>
                <p><strong>Carta de presentación:</strong></p>
                <p>{{ $coverLetter }}</p>
            </div>

            <p>Puedes revisar el perfil completo del candidato en tu panel de control de EmpleaWorks.</p>

            <p>Saludos,<br>
                El equipo de EmpleaWorks</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} EmpleaWorks. Todos los derechos reservados.
        </div>
    </div>
</body>

</html>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo mensaje de contacto</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #7c28eb;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .field {
            margin-bottom: 15px;
        }
        .label {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .message-box {
            background-color: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #7c28eb;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Nuevo mensaje de contacto</h1>
    </div>
    
    <div class="content">
        <div class="field">
            <div class="label">Nombre:</div>
            <div>{{ $name }}</div>
        </div>
        
        <div class="field">
            <div class="label">Email:</div>
            <div>{{ $email }}</div>
        </div>
        
        <div class="field">
            <div class="label">Tipo de consulta:</div>
            <div>{{ $inquiryType }}</div>
        </div>
        
        <div class="field">
            <div class="label">Asunto:</div>
            <div>{{ $subject }}</div>
        </div>
        
        <div class="field">
            <div class="label">Mensaje:</div>
            <div class="message-box">{{ $message }}</div>
        </div>
    </div>
    
    <div class="footer">
        Este mensaje fue enviado desde el formulario de contacto de EmpleaWorks.
    </div>
</body>
</html>

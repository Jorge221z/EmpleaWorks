<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class CvController extends Controller
{
    /**
     * Permite la descarga del CV de un candidato
     *
     * @param  \App\Models\Candidate  $candidate Candidato del que se descargará el CV
     * @return \Symfony\Component\HttpFoundation\Response Respuesta con el archivo para descarga
     */
    public function download(Candidate $candidate)
    {
        // Verifica si el candidato tiene CV asignado
        if (!$candidate->cv) {
            abort(404, 'CV no encontrado');
        }

        // Verifica si el archivo existe
        if (!Storage::disk('public')->exists($candidate->cv)) {
            abort(404, 'Archivo no encontrado');
        }

        // Obtiene la ruta completa del archivo
        $path = Storage::disk('public')->path($candidate->cv);

        // Obtiene el nombre original del archivo
        $filename = basename($candidate->cv);

        // Determina el tipo de contenido según la extensión
        $contentType = $this->getContentType($path);

        // Genera la respuesta para la descarga del archivo
        return response()->file($path, [
            'Content-Type' => $contentType,
            'Content-Disposition' => 'attachment; filename="' . $filename . '"'
        ]);
    }

    /**
     * Determina el tipo de contenido según la extensión del archivo
     *
     * @param  string  $path Ruta del archivo
     * @return string Tipo MIME correspondiente al archivo
     */
    private function getContentType($path)
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        switch ($extension) {
            case 'pdf':
                return 'application/pdf';
            case 'doc':
                return 'application/msword';
            case 'docx':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            default:
                return 'application/octet-stream';
        }
    }
}

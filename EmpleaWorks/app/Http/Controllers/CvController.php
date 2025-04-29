<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class CvController extends Controller
{
    /**
     * Download a candidate's CV.
     *
     * @param  \App\Models\Candidate  $candidate
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function download(Candidate $candidate)
    {
        // Check if the candidate has a CV
        if (!$candidate->cv) {
            abort(404, 'CV no encontrado');
        }

        // Check if the file exists in storage
        if (!Storage::disk('public')->exists($candidate->cv)) {
            abort(404, 'Archivo no encontrado');
        }

        // Get the full path to the file
        $path = Storage::disk('public')->path($candidate->cv);
        
        // Get the original filename, or use a default if it can't be determined
        $filename = basename($candidate->cv);
        
        // Set the content type based on the file extension
        $contentType = $this->getContentType($path);
        
        // Return the file as a download response
        return response()->file($path, [
            'Content-Type' => $contentType,
            'Content-Disposition' => 'attachment; filename="' . $filename . '"'
        ]);
    }
    
    /**
     * Determine the content type based on file extension.
     *
     * @param  string  $path
     * @return string
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

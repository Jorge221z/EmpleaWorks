<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EmailVerificationController extends Controller
{
    /**
     * Verificar si el email del usuario está verificado.
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'success' => true,
            'data' => [
                'email_verified' => $user->hasVerifiedEmail(),
                'email' => $user->email,
                'user_id' => $user->id,
            ]
        ]);
    }

    /**
     * Reenviar email de verificación.
     */
    public function resend(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'El email ya está verificado.',
                'data' => [
                    'email_verified' => true,
                    'email' => $user->email,
                ]
            ], 200);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'Email de verificación enviado correctamente.',
            'data' => [
                'email_verified' => false,
                'email' => $user->email,
                'resent_at' => now()->toISOString(),
            ]
        ]);
    }

    /**
     * Verificar email requerido para acciones específicas.
     * Esta función se puede usar en cualquier controlador para verificar el email.
     */
    public static function requireEmailVerification($user): ?JsonResponse
    {
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'error' => 'email_not_verified',
                'message' => 'Necesitas verificar tu email para realizar esta acción.',
                'data' => [
                    'email_verified' => false,
                    'email' => $user->email,
                    'user_id' => $user->id,
                    'action_required' => 'email_verification',
                ]
            ], 403);
        }
        
        return null;
    }

    /**
     * Obtener pantalla de aviso de verificación (para React Native)
     */
    public function notice(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'success' => true,
            'data' => [
                'email_verified' => $user->hasVerifiedEmail(),
                'email' => $user->email,
                'user_id' => $user->id,
                'notice' => [
                    'title' => 'Verifica tu email',
                    'message' => 'Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, verifica tu email para continuar.',
                    'action_text' => 'Reenviar email',
                    'action_url' => '/api/email/verification-notification'
                ]
            ]
        ]);
    }
}

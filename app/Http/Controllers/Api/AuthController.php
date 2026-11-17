<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    private function urlFrontend(): string
    {
        return rtrim(env('FRONTEND_URL', 'http://localhost:4200'), '/');
    }

    // POST /api/register
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            // Un compte admin ne peut pas être créé depuis l'inscription publique
            'role' => 'required|in:agriculteur,acheteur',
            'telephone' => 'nullable|string|max:20',
            'localisation' => 'nullable|string|max:255',
            'adresse' => 'nullable|string|max:255',
            'matricule' => 'nullable|string|max:50|unique:users',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'telephone' => $request->telephone,
            'localisation' => $request->localisation,
            'adresse' => $request->adresse,
            'matricule' => $request->matricule,
        ]);

        // Email de vérification (le compte est créé même si l'envoi échoue : on peut le renvoyer)
        try {
            $user->sendEmailVerificationNotification();
        } catch (\Throwable $e) {
            Log::warning('Envoi email de verification impossible : ' . $e->getMessage());
        }

        // Pas de token ici : l'utilisateur doit d'abord vérifier son email puis se connecter
        return response()->json([
            'message' => 'Compte créé. Un email de vérification vous a été envoyé.',
            'user' => $user,
        ], 201);
    }

    // GET /api/email/verify/{id}/{hash} : lien reçu par email (signé)
    public function verifierEmail(Request $request, $id, $hash): RedirectResponse
    {
        $user = User::find($id);

        if (! $user || ! hash_equals(sha1($user->getEmailForVerification()), (string) $hash)) {
            return redirect()->away($this->urlFrontend() . '/login?verifie=0');
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return redirect()->away($this->urlFrontend() . '/login?verifie=1');
    }

    // POST /api/email/renvoyer : renvoyer l'email de vérification
    public function renvoyerVerification(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if ($user && ! $user->hasVerifiedEmail()) {
            try {
                $user->sendEmailVerificationNotification();
            } catch (\Throwable $e) {
                Log::warning('Renvoi email de verification impossible : ' . $e->getMessage());
            }
        }

        // Réponse identique dans tous les cas (ne révèle pas si l'email existe)
        return response()->json(['message' => 'Si ce compte existe, un email de vérification a été envoyé.']);
    }

    // POST /api/login
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        // L'admin (créé à la main) n'a pas besoin de vérifier son email
        if (config('services.email_verification_required') && $user->role !== 'admin' && ! $user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Votre email n\'est pas encore vérifié. Consultez votre boîte mail.',
                'code' => 'email_non_verifie',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    // POST /api/logout
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Deconnexion reussie']);
    }
}

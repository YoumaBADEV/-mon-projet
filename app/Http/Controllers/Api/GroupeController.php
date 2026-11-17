<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Groupe;
use App\Models\Participer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GroupeController extends Controller
{
    private function reserveAgriculteur(Request $request): ?JsonResponse
    {
        if ($request->user()->role !== 'agriculteur') {
            return response()->json(['message' => 'Réservé aux agriculteurs.'], 403);
        }
        return null;
    }

    // GET /api/groupes : tous les groupes, avec nombre de membres et statut de l'utilisateur
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $groupes = Groupe::with('createur:id,nom,prenom,name')
            ->withCount('participations as nb_membres')
            ->latest()
            ->get()
            ->map(function (Groupe $g) use ($userId) {
                $part = $g->participations()->where('agriculteur_id', $userId)->first();
                $g->est_membre = $part !== null;
                $g->mon_role = $part?->role;
                return $g;
            });

        return response()->json($groupes);
    }

    // GET /api/groupes/{groupe} : détail avec la liste des membres
    public function show(Groupe $groupe): JsonResponse
    {
        $groupe->load('createur:id,nom,prenom,name', 'participations.agriculteur:id,nom,prenom,name');

        return response()->json($groupe);
    }

    // POST /api/groupes : creerGroupe()
    public function store(Request $request): JsonResponse
    {
        if ($refus = $this->reserveAgriculteur($request)) return $refus;

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
        ]);

        $groupe = DB::transaction(function () use ($request, $validated) {
            $groupe = Groupe::create($validated + ['createur_id' => $request->user()->id]);

            // Le créateur rejoint automatiquement son groupe comme responsable
            Participer::create([
                'groupe_id' => $groupe->id,
                'agriculteur_id' => $request->user()->id,
                'role' => 'responsable',
            ]);

            return $groupe;
        });

        return response()->json($groupe, 201);
    }

    // PUT /api/groupes/{groupe} : modifierGroupe() (réservé au créateur)
    public function update(Request $request, Groupe $groupe): JsonResponse
    {
        if ($groupe->createur_id !== $request->user()->id) {
            return response()->json(['message' => 'Seul le créateur peut modifier ce groupe.'], 403);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string|max:2000',
        ]);

        $groupe->update($validated);

        return response()->json($groupe);
    }

    // POST /api/groupes/{groupe}/participer : rejoindre un groupe
    public function participer(Request $request, Groupe $groupe): JsonResponse
    {
        if ($refus = $this->reserveAgriculteur($request)) return $refus;

        $existe = Participer::where('groupe_id', $groupe->id)
            ->where('agriculteur_id', $request->user()->id)
            ->exists();

        if ($existe) {
            return response()->json(['message' => 'Vous participez déjà à ce groupe.'], 422);
        }

        $participation = Participer::create([
            'groupe_id' => $groupe->id,
            'agriculteur_id' => $request->user()->id,
            'role' => 'membre',
        ]);

        return response()->json($participation, 201);
    }

    // DELETE /api/groupes/{groupe}/participer : quitter un groupe
    public function quitter(Request $request, Groupe $groupe): JsonResponse
    {
        if ($groupe->createur_id === $request->user()->id) {
            return response()->json(['message' => 'Le créateur ne peut pas quitter son groupe.'], 422);
        }

        Participer::where('groupe_id', $groupe->id)
            ->where('agriculteur_id', $request->user()->id)
            ->delete();

        return response()->json(null, 204);
    }
}

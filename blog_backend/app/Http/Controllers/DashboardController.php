<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Friendship;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Récupérer les ids des amis acceptés et non bloqués
        $amisIds = Friendship::where(function($query) {
                                $query->where('sender_id', auth()->id())
                                      ->orWhere('receiver_id', auth()->id());
                            })
                            ->where('statut', 'accepte')
                            ->get()
                            ->map(function($friendship) {
                                // Retourner l'id de l'ami
                                // (pas mon propre id)
                                return $friendship->sender_id == auth()->id()
                                    ? $friendship->receiver_id
                                    : $friendship->sender_id;
                            });

        // Mes articles + articles publics de mes amis
        $articles = Article::where('user_id', auth()->id())
                          ->orWhere(function($query) use ($amisIds) {
                              $query->whereIn('user_id', $amisIds)
                                    ->where('visibilite', 'public');
                          })
                          ->with('user')
                          ->orderBy('created_at', 'desc')
                          ->get()
                          ->map(function ($article) {
                              return [
                                  'id' => $article->id,
                                  'titre' => $article->titre,
                                  'contenu' => $article->contenu,
                                  'visibilite' => $article->visibilite,
                                  'auteur' => optional($article->user)->username,
                                  'commentaire_actives' => $article->commentaire_actives,
                              ];
                          });

        return response()->json([
            'articles' => $articles,
        ]);
    }
}
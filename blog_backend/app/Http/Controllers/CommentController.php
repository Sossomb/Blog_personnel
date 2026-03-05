<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Comment;

class CommentController extends Controller
{
    //Ajouter un commentarire
    public function store(Request $request, $article_id){

        //Verifier que l'article existe
        $article = Article::find($article_id);
        if(! $article){
            return response()->json([
                'message' => 'Article non trouve'
            ],404);
        }

        //Verifier que les commentaires sont activees
        if(!$article->commentaire_actives){
            return response()->json([
                'message' => 'Commentaire non active'
            ],403);
        }
         $request->validate([
            'contenu' => 'required|string'
        ]);

        $comment = Comment::create([
            'user_id'    => auth()->id(),
            'article_id' => $article_id,
            'contenu'    => $request->contenu
        ]);
         return response()->json([
            'message' => 'Commentaire ajouté',
            'comment' => $comment
        ], 201);

    }

    //Voir les commentaires d'un article
    public function index($article_id){
        $article = Article::find($article_id);
        if (!$article) {
            return response()->json([
                'message' => 'Article non trouvé'
            ], 404);
        }

        $comments = Comment::where('article_id', $article_id)
                          ->with('user')
                          ->orderBy('created_at', 'desc')
                          ->get();

        return response()->json($comments);
    }

    //Supprimer un commentaire
    public function destroy($id)
    {
        $comment = Comment::where('id', $id)
                         ->where('user_id', auth()->id())
                         ->first();

        if (!$comment) {
            return response()->json([
                'message' => 'Commentaire non trouvé'
            ], 404);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Commentaire supprimé'
        ]);
        
    }
}

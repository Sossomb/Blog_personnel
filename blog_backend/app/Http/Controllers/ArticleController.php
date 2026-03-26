<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;


class ArticleController extends Controller
{
    //Creer un article
    public function store(Request $request){
        $request->validate([
            'titre' => 'required|string',
            'contenu' => 'required|string',
            'visibilite' => 'required|in:public,prive',
            'commentaire_actives' => 'required|boolean',
        ]);
        $article = Article::create([
            'user_id' =>auth()->id(),
            'titre' =>$request->titre,
            'contenu'=>$request->contenu,
            'visibilite'=>$request->visibilite,
            'commentaire_actives'=>$request->commentaire_actives
        ]);
        return response()->json([
                'message'=> 'Article crée avec succes',
                'article'=> $article
        ], 201);
        }
        
        //Lister ses articles
        public function index(){
                $articles = Article::where('user_id',auth()->id())
                ->orderBy('created_at','desc')
                ->get();
                return response()->json($articles);
        }

        //Voir un article spécifique
        public function show($id){
            $article = Article::where('id',$id)
                    ->where('user_id', auth()->id())
                    ->first();
            
            if (!$article){
                return response()->json([
                    'message' => 'Article non trouvé'
                ],404);
            }
            return response()->json($article);
        }

        //Modifier un article
        public function update(Request $request, $id){
                $article = Article::where('id',$id)
                        ->where('user_id',auth()->id())
                        ->first();

                if (! $article){
                    return response()->json([
                        'message' => 'Article non trouve'
                    ],404);
                }

                $request->validate([
                    'titre' => 'string',
                    'contenu' => 'string',
                    'visibilite' => 'in:public,prive',
                    'commentaire_actives' => 'boolean',
                ]);
                $article->update($request->only(['titre', 'contenu', 'visibilite', 'commentaire_actives']));

            return response()->json([
                'message' =>'Article modifie avec succes',
                'article' => $article
            ]);
        }

        //Supprimer un article
        public function destroy($id){
            $article = Article::where('id',$id)
                    ->where('user_id', auth()->id())
                    ->first();
            
                    if (! $article){
                        return response()->json([
                            'message' => 'Article non trouvé'
                        ],404);
                    }
            $article->delete();
            return response()->json([
                'message' => 'Article supprime avec succes'
            ]);
        }
}

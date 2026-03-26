<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use Illuminate\Http\Request;
use App\Models\User;

class FriendshipController extends Controller
{
    //Rechercher utilisateur par son username
    public function search(Request $request){
        $request->validate([
            'username' => 'required|string',
        ]);

        $users = User::where('username','like','%'. $request->username . '%')
                    ->where('id', '!=', auth()->id())
                    ->get();

        return response()->json($users);
    }

    //Envoyer une demande d'ami
    public function sendRequest($receiver_id){

        //Verifier que l'utilisateur existe
        $receiver = User::find($receiver_id);
        if(! $receiver){
            return response()->json([
                'message' => 'Utilisateur non trouvé'
            ],404);
        }

        //Verifier qu'une demande n'existe pas deja (dans les deux sens)
        $existingRequest = Friendship::where(function ($q) use ($receiver_id) {
                                    $q->where('sender_id', auth()->id())
                                      ->where('receiver_id', $receiver_id);
                                })->orWhere(function ($q) use ($receiver_id) {
                                    $q->where('sender_id', $receiver_id)
                                      ->where('receiver_id', auth()->id());
                                })->first();
        if($existingRequest){
            return response()->json([
                'message' => 'Une demande est deja en cours'
            ]);
        }

        $friendship = Friendship::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $receiver_id,
            'statut' => 'en_attente'
        ]);
        return response()->json([
            'message' => 'Demande envoyé avec succes',
            'friendship' => $friendship
        ],201);
    }

    //Accepter une demande d'ami
    public function acceptRequest($friendship_id){
        $friendship = Friendship::where('id', $friendship_id)
                               ->where('receiver_id', auth()->id())
                               ->where('statut', 'en_attente')
                               ->first();
        if(! $friendship){
            return response()->json([
                'message' => 'Demande non trouve'
            ],404);
        }
        $friendship->update(['statut'=> 'accepte']);
        return response()->json([
            'message' => 'Demande accepte avec succes'
        ]);
    }

    //Refuser une demande d'ami
    public function rejectRequest($friendship_id){
        $friendship = Friendship::where('id',$friendship_id)
                                ->where('receiver_id',auth()->id())
                                ->where('statut','en_attente')
                                ->first();
        if(! $friendship){
            return response()->json([
                'message' => 'Demande non trouvé'
            ],404);
        }

        $friendship->delete();
        return response()->json([
            'message' => 'Demande refusee'
        ]);
    }

    //Voir la liste de ses amis
        public function index(){
            $amis = Friendship::where(function($query){
                                                $query->where('sender_id',auth()->id())
                                                      ->orWhere('receiver_id',auth()->id());
            })
            ->where('statut','accepte')
            ->with(['sender','receiver'])
            ->get();
        $friends = $amis->map(function ($f) {
            $me = auth()->id();
            $other = ($f->sender_id == $me) ? $f->receiver : $f->sender;
            return [
                'id' => $f->id,
                'username' => optional($other)->username,
            ];
        })->values();

        return response()->json($friends);
        }

        //Supprimer un ami
        public function destroy($friendship_id){
              $friendship = Friendship::where('id', $friendship_id)
                               ->where(function($query) {
                                   $query->where('sender_id', auth()->id())
                                         ->orWhere('receiver_id', auth()->id());
                               })
                               ->first();
            
                 if (!$friendship) {
            return response()->json([
                'message' => 'Ami non trouvé'
            ], 404);
        }
        $friendship->delete();

        return response()->json([
            'message' => 'Ami supprimé avec succes'
        ]);

        }

        //Bloquer un ami
        public function block($friendship_id){
             $friendship = Friendship::where('id', $friendship_id)
                               ->where(function($query) {
                                   $query->where('sender_id', auth()->id())
                                         ->orWhere('receiver_id', auth()->id());
                               })
                               ->first();
            
        if (!$friendship) {
            return response()->json([
                'message' => 'Ami non trouvé'
            ], 404);
        }
        $friendship->update(['statut' => 'bloque']);

        return response()->json([
            'message' => 'Utilisateur bloqué'
        ]);
        }
        //Voir les demandes recues en attente
        public function pendingRequests(){

        $demandes = Friendship::where('statut', 'en_attente')
            ->where(function ($q) {
                $q->where('receiver_id', auth()->id())
                  ->orWhere('sender_id', auth()->id());
            })
            ->with(['sender', 'receiver'])
            ->get();

        $pending = $demandes->map(function ($f) {
            $me = auth()->id();
            $type = ($f->receiver_id == $me) ? 'recue' : 'envoyee';
            $other = ($type === 'recue') ? $f->sender : $f->receiver;

            return [
                'id' => $f->id,
                'type' => $type,
                'username' => optional($other)->username,
            ];
        })->values();

        return response()->json($pending);
         }
}

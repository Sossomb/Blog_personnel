<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    //Inscription
    public function register(Request $request){
        $request->validate([
            'nom_complet' => 'required|string',
            'username' => 'required|string|unique:users',
            'password' => 'required|string|min:6'
        ]);
        $user = User::create([
                'nom_complet' => $request->nom_complet,
                'username' => $request->username,
                'password' => Hash::make($request->password)
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
                'message' => 'Inscription reussie',
                'user' => $user,
                'token' => $token
        ], 201);

    }

    //Connexion
    public function login(Request $request){
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('username',$request->username)->first();
        if (!$user || !Hash::check($request->password,$user->password)){
            return response()->json([
                'message' => 'Identifiants incorrects'
            ],401);
        }

         $token = $user->createToken('auth_token')->plainTextToken;
          return response()->json([
                'message' => 'Connexion reussie',
                'user' => $user,
                'token' => $token
        ], 201);
    }

    //Deconnexion
    public function logout(Request $request){
        $request->user()->CurrentAccessToken()->delete();
        
        return response()->json([
            'message' => 'Deconnexion reussie'
        ]);
    }

}

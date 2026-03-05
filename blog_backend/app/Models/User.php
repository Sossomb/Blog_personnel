<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom_complet',
        'username',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];
    //Un utilisateur a plusieurs articles
    public function articles(){
        return $this->hasMany(Article::class);
    }
    //Un utilisateur a plusieurs commentaires
    public function comments(){
        return $this->hasMany(Comment::class);
    }

    //Demandes d'amis envoyes
    public function sentFriendships(){
        return $this->hasMany(Friendship::class,'sender_id');
    }

    //Demandes d'amis recus
    public function receivedFriendships(){
        return $this->hasMany(Friendship::class,'receiver_id');
    }
}

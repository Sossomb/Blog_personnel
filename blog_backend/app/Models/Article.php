<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'user_id',
        'titre',
        'contenu',
        'visibilite',
        'commentaire_actives'
    ];

    //Un article appartient a un utilisateur
    public function user(){
        return $this->belongsTo(User::class);
    } 

    //Un article peut avoir plusieurs commentaires
    public function comments(){
        return $this->hasMany(Comment::class);
    }
    
}

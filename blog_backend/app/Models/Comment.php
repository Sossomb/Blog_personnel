<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'user_id',
        'article_id',
        'contenu'
    ];
    //Un commentaire appartient a un utilisateur
    function user(){
        return $this->belongsTo(User::class);
    }
    //Un commentaire appartient a un article
    function article(){
        return $this->belongsTo(Article::class);
    }
}

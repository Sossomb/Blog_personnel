<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Friendship extends Model
{
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'statut'
    ];

    //Celui qui envoie la demande
    function sender(){
        return $this->belongsTo(User::class,'sender_id');
    }
    //Celui qui recoit la demande
    function receiver(){
        return $this->belongsTo(User::class,'receiver_id');
    }
}

<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FriendshipController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//Routes publics
Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);

//Routes protegees
Route::middleware('auth:sanctum')->group(function() {

    //Authentification
    Route::post('/logout',[AuthController::class,'logout']);

    //Dashboard
    Route::get('/dashboard',[AuthController::class,'index']);

    //Articles
    Route::get('/articles',[ArticleController::class,'index']);
    Route::post('/articles',[ArticleController::class,'store']);
    Route::get('/articles/{id}',[ArticleController::class,'show']);
    Route::put('/articles/{id}',[ArticleController::class,'update']);
    Route::delete('/articles/{id}',[ArticleController::class,'destroy']);

    //Amis
    Route::get('/friends',[FriendshipController::class,'index']);
    Route::get('/friends/search',[FriendshipController::class,'search']);
    Route::get('/friends/pending',[FriendshipController::class,'pendingRequests']);
    Route::post('/friends/send/{receiver_id}',[FriendshipController::class,'sendRequest']);
    Route::put('/friends/accept/{firendship_id}',[FriendshipController::class,'acceptRequest']);
    Route::put('/friends/reject/{firendship_id}',[FriendshipController::class,'rejectRequest']);
    Route::put('/friends/block/{firendship_id}',[FriendshipController::class,'block']);
    Route::delete('/friends/{firendship_id}',[FriendshipController::class,'destroy']);

    //Commentaires
    Route::get('/articles/{article_id}/comments',[CommentController::class,'index']);
    Route::post('/articles/{article_id}/comments',[CommentController::class,'store']);
    Route::delete('/articles/{article_id}/comments',[CommentController::class,'destroy']);

});

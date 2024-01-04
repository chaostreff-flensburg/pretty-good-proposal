<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Track;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function me(){
        if (!Auth::check()){
            abort(403);
        }
        return Auth::user();
    }

    public function update(User $user, Request $request){
        if (!Auth::check()){
            abort(403);
        }
        if(Auth::user()->username != $user->username){
            abort(403);
        }
        $user->username = $request->username;
        $user->email = $request->email;
        $user->save();
        return $user;
    }
    public function updatePassword(User $user, Request $request){
        if (!Auth::check()){
            abort(403);
        }
        if(Auth::user()->username != $user->username){
            abort(403);
        }
        $user->makeVisible(['password']);
        if (Hash::check($request->oldPassword, $user->password)) {
            $user->password = Hash::make($request->newPassword);
            $user->save();
            return $user;
         } else {
            abort(406);
         }
    }
}

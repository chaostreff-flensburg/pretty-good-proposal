<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Track;
use App\Models\User;
use App\Models\Proposal;

class TrackController extends Controller
{

    public function index()
    {
        if (!Auth::check()){
            abort(403);
        }
        $user = Auth::user();
        if($user->username === 'root'){
            return Track::all();
        }
        $userTracks = User::where('id', $user->id)->with('tracks')->first();
        return $userTracks->tracks;
    }

    public function create(Request $request)
    {
        if (!Auth::check()){
            abort(403);
        }
        $user = Auth::user();
        if($user->username != 'root'){
            abort(403);
        }
        $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string',
            'public_key' => 'required|string',
        ]);
        $track = new Track();
        $track->name = $request->name;
        $track->slug = $request->slug;
        $track->public_key = $request->public_key;
        $track->save();
        return $track;
    }

    public function addUserToTrack(Request $request)
    {
        if (!Auth::check()){
            abort(403);
        }
        $user = Auth::user();
        if($user->username != 'root'){
            abort(403);
        }
        $user = User::where('username', $request->username)->first();
        $user->tracks()->attach($request->track_id);
        return $user;
    }

    public function show(Request $request)
    {
        return Track::where('slug', $request->slug)->firstOrFail();
    }

    public function proposals(Request $request)
    {
        if (!Auth::check()){
            abort(403);
        }
        $user = Auth::user();
        $track = Track::where('slug', $request->slug)->with('users')->firstOrFail();
        if(!$track->users->contains($user->id)){
            abort(403);
        }

        $proposals = Proposal::where('track_id', $track->id)->where('status', $request->proposalStatus)->with('opinions', 'opinions.user')->get();

        return [
            'proposals' => $proposals,
            'users' => $track->users,
        ];
    }

    public function exportTrackData (Request $request)
    {
        if (!Auth::check()){
            abort(403);
        }
        $user = Auth::user();
        $track = Track::where('slug', $request->slug)->with('users', 'proposals', 'proposals.opinions', 'proposals.opinions.user', )->firstOrFail();
        if(!$track->users->contains($user->id)){
            abort(403);
        }
        return $track;

    }
}

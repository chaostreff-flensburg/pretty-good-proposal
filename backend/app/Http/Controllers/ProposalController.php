<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Track;
use App\Models\Proposal;

class ProposalController extends Controller
{
    public function create(Request $request)
    {
        $track = Track::where('slug', $request->slug)->firstOrFail();
        $proposal = new Proposal();
        $proposal->track_id = $track->id;
        $proposal->name = $request->name;
        $proposal->encrypted_data = $request->encrypted_data;
        $proposal->encrypted_symatric_key = $request->encrypted_symatric_key;
        $proposal->status = 'created';
        $proposal->save();

        return $proposal->only('id');
    }

    public function show(Proposal $proposal)
    {
        if (!Auth::check()){
            abort(403);
        }
        $user = Auth::user();
        $proposal->load('track','track.users', 'opinions');

        if(!$proposal->track->users->contains($user->id)){
            abort(403);
        }
        return $proposal;
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Track;
use App\Models\Proposal;
use App\Models\Opinion;

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
        $proposal->load('track', 'opinions','opinions.user', );

        if(!$proposal->track->users->contains($user->id)){
            abort(403);
        }
        return $proposal;
    }

    public function upsertOpinion(Proposal $proposal, Request $request)
    {
        if (!Auth::check()){
            abort(403);
        }

        $user = Auth::user();
        $track = $proposal->track->load('users');
        if(!$track->users->contains($user->id)){
            abort(403);
        }
        $request->validate([
            'vote' => 'required|numeric',
            'comment' => 'required|string',
        ]);
        $opinion = Opinion::where('proposal_id', $proposal->id)->where('user_id', $user->id)->first();
        if($opinion){
            $opinion->vote = $request->vote;
            $opinion->comment = $request->comment;
            $opinion->save();
            return $opinion;
        }else{
            $opinion = new Opinion();
            $opinion->proposal_id = $proposal->id;
            $opinion->user_id = $user->id;
            $opinion->vote = $request->vote;
            $opinion->comment = $request->comment;
            $opinion->save();
        }
        return $opinion;
    }
}

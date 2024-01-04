<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Only for development use
        $rootUser = new User();
        $rootUser->username = 'root';
        $rootUser->email = 'root@chaostreff-flensburg.de';
        $rootUser->password = Hash::make('rootroot');
        $rootUser->email_verified_at = now();
        $rootUser->save();

        $user = new User();
        $user->username = 'user';
        $user->email = 'user@chaostreff-flensburg.de';
        $user->password = Hash::make('useruser');
        $user->email_verified_at = now();
        $user->save();

        $track = new \App\Models\Track();
        $track->name = 'CCC 42';
        $track->slug = 'ccc-42';
        $track->public_key = '{"alg":"RSA-OAEP-512","e":"AQAB","ext":true,"key_ops":["encrypt"],"kty":"RSA","n":"yH-fhNikSkvSIMrjxJPfVQdz4KQYEy71xBi258Y8JugEsewNkN32e5G-oLin63IdygLuOhONX9fzKLQmH3mhxCYwKH-H5MxyKa2GJbQ6b3_AkUk5CqmWgJ-oVcyRYVy85MkKj4JBIqvmDBYTYMK5i7eTYgtiQPF41o_BkgYxVq21ty6NyX4x8uSfhv29004Kybn09Kb0fcM3FyVig-mCkq4MAUVH3aimiV0n07DNDZSh0Pf_mjIRvgCSGq1jtt2uEwQ281x0vgDL6u1yeamOQDeLDqCGfWTfOfzY3r66rg2trmstGBHyZzFywr4mAK-t_YjOOcXYucQXWTIqaFn8P5-hj8Y9o_2mz-PDZDi6fhRFoGRufQrEvKOP8kAOgBp2hJkohV_LPTL_wxiqjzQIwI2iQAVyEy6E82es4fZw3unV7sSWaaDLy2XO_UCvWYC6WAlcxFKj2kZkCHYXQMgm2aabzPzuzPoiNe2XrMNPUZBlkH-vFDN1qJ0Ch0WlhrD8biKS98gWDJoOKX4ra2HPTCR5RBGvq4WqnPXekAWBbYeAlIQbgyuOq-t5UtBFK61iBAI3JWc_NgHvelgWu5vhcOCr4Y7z1XNDpkAVza4X-66SE-hpQvbMlaGr4oxM5GbCT__aj7jG7epqSFKkZnrZmCwey60CYFQz-_mUt6peF-M"}';
        $track->save();

        $user->tracks()->attach($track->id);

        $proposal = new \App\Models\Proposal();
        $proposal->track_id = $track->id;
        $proposal->name = 'Test Proposal 1';
        $proposal->encrypted_data = 'Tni1AwFx/vgNIu38D6Mj5TnKWV+HCO+PqvRaICNYYdv8epe8BMb6CwT0+JgsjqNUqXGRgG4Von2DwgeZwmmRl/mjIiBo5A2He75LQq8BNKMF5jxFWENd1Id5GBpH69gBPzO9e7ZOrQnKugPfJOycdJ7rkTCwHmsAJUs0BZDJolxrEJhIaaG5Q3DtPgyMu9uNlm5i5hbqQqs6OKWIAA5jEaxkW7Wq9a7PWt6ojVfUROn9hHXgA437PobT+++/nFevJJAZl3la7uAB9tMYm/5mFr+qOKI5h8RlHXtQQ4S6RuaGqz8qoN8aHbmjj+VVSnCVX3ymjRARtnAzgUabtDI3blGto59dB7VMAeeEiEP+NkFWfBkPTSXYGBlov5jVeAxZBjAj7OACusMXn3tecNA7owboow8S8SL6JrsiabEUvDRYXtIzMTSmvB6kKNyJk8L78aqaN0E+D1DP27LaLzKgHBdYX8hrbpILp10=';
        $proposal->encrypted_symatric_key = 'KYklf00ms/HEnx5EwqwsS4SupfPAd2F0zMBw78Yn5omcH47/yVsa6GBNsDduu3lm/E+MzDD9vnW2K4bQCs9KM70GD3zllqZ8tBkvxratlgcWchifM+Uv0WtQKu/HRQjJs8gZbZm8vMpQDgJLOhKqwtzK4x8gH6A3lr6cdET/dMPYI9GKarCBzGzBkBTJVt8qgtun48+yS6W8rZURZf49t94kX92bThhuSeALW+ffRYXjWuZvKBNdccDEwQjfQ1oDLXYEtJUVb1BtuUbNmhNmDXtDRBjhyvKhJnKi4mwjX8+qJPOepAK9InU6rs/J4MRoDDtMHJhiL1ARYcaEJNHfY+PLkqDNh3JeYQer0LZiPSZaTL4RQCPz2cGY8ZNGmMu6fqrKXGQhpJ/Ux8BfAgyiOld0NICQ5aBJMcxk6w0HFSFHBcXToWw6LQh2OviM4U8tY+OCuN0/2zBn+1onVQTIJlIgkSQJby2xmhyXKPnrxhPTsNsx6Bnt2AQhwXLzld/dYfqsnqR56qcv+2kDcrJezf1aVmRX9Yu7IyCq28xWrDNm09x7kWXmGelnAX2wWiAFhiC9AqZD8rfMsooJKu9kNCzXS27sAbtV0z4CbjQRAUl6Ud2JullBvV8bRfERkrj3lAFjHou8wE7gaTx6HOWw7wHwThxp2AbYRpKsPvRWCuM=';
        $proposal->save();

        $opinion = new \App\Models\Opinion();
        $opinion->proposal_id = $proposal->id;
        $opinion->user_id = $user->id;
        $opinion->vote = '0.42';
        $opinion->comment = 'Da sollte man nochmal drüber nachdenken';
        $opinion->save();
    }
}

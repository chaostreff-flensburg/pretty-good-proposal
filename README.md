# PGP - Pretty Good Proposal V2

Mange different proposals tracks with a simple web application [License](./LICENSE).

First build to manage [Chaotic Catalyst Scholarships (CCS)](https://ccs.chaostreff-flensburg.de/).

You can see a running version [bewerben.c3fl.de](https://bewerben.c3fl.de). You can find a very [short talk (2:40 Minutes) from cccamp23 on youtube](https://youtu.be/y4a9_POxGws?si=DWvt5urfD1hWnc-6)

## Features

- Create Tracks
- Create proposals
- Encyrpt proposals with [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API). For more infomration please have a look at the [lib](./src/lib/) Folder and different files.
- Save encrypted proposals to a database.
- Only advisary board can decrypt proposals (with a manuel shared private)
- Advisary board can vote and decide on proposals
- Every Track has a custom URL and public key
- A root user can create tracks, users (advisary board) and connect them both
- You can easily export all track data as json

> This is a work in progress. The application could be setup for other projects. Please be aware that this is a very early version. There is no guarantee that this application is secure. Only use it if encrytion is a nice to have feature!!!

## Technical Setup

### Frontend

The Frontendn is a Vue3 (JavaScript) which is completly standalone.

### Backend

The Backend is a Laravel application. It uses a sqllite as database.

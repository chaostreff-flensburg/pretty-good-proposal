# PGP - Pretty good Proposal

Purpose build for [Chaotic Catalyst Scholarships (CCS)](https://ccs.chaostreff-flensburg.de/). This is a web application to create and manage proposals for the CCS. [License](./LICENSE)

You can see a running version [bewerben.ccs.chaostreff-flensburg.de](https://bewerben.ccs.chaostreff-flensburg.de/#/). You can find a very [short talk (2:40 Minutes) from cccamp23 on youtube](https://youtu.be/y4a9_POxGws?si=DWvt5urfD1hWnc-6)

## Features

- Create proposals
- Encyrpt proposals with [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API). For more infomration please have a look at the [lib](./src/lib/) Folder and different files.
- Save encrypted proposals to a database.
- Only advisary board can decrypt proposals (with a manuel shared private)
- Advisary board can vote and decide on proposals

> This is a work in progress. The application is not ready for easy setup for other projects.

## Technical Setup

### Frontend

#### Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

#### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

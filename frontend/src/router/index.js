import { createRouter, createWebHashHistory } from "vue-router";
import { isLoggedIn, setLogin, user } from "../lib/api";
import Login from "../views/Login.vue";
import SubmitProposal from "../views/Proposal.vue";
import ProposalsTrack from '../views/orga/ProposalsTrack.vue';

import Overview from "../views/orga/Overview.vue";
import OrgaView from "../views/OrgaView.vue";
import Proposal from "../views/orga/Proposal.vue";
import Profile from "../views/orga/Profile.vue";
import Faq from "../views/orga/Faq.vue";
import Error from "../views/Error.vue";

import RootTracks from '../views/orga/RootTracks.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "submit-proposal",
      component: SubmitProposal,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/orga",
      name: "overview",
      component: OrgaView,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          name: "orga",
          component: Overview,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "faq",
          name: "faq",
          component: Faq,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "profile",
          name: "profile",
          component: Profile,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "track/:slug",
          name: "proposalsTrack",
          component: ProposalsTrack,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/proposal/:id",
          name: "proposal",
          component: Proposal,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/root/tracks",
          name: "tracks",
          component: RootTracks,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: "error",
      component: Error,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (!isLoggedIn() && localStorage.getItem("auth")) {
    const localStorageAuth = JSON.parse(localStorage.getItem("auth"))
    setLogin(localStorageAuth.user, localStorageAuth.token)
  }
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !isLoggedIn()) next("/login");
  //else if(!requiresAuth && currentUser) next("/orga");
  else next();
});

export default router;

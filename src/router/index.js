import { createRouter, createWebHashHistory } from "vue-router";
import { supabase } from "../supabase";

import Login from "../views/Login.vue";
import SubmitProposal from "../views/Proposal.vue";
// import Crypto from '../views/Crypto.vue'

import Overview from "../views/orga/Overview.vue";
import Proposal from "../views/orga/Proposal.vue";
import Profile from "../views/orga/Profile.vue";
import Faq from "../views/orga/Faq.vue";

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
    // {
    //   path: '/crypto',
    //   name: 'crypto',
    //   component: Crypto
    // },
    {
      path: "/orga",
      name: "overview",
      component: Overview,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/orga/profile",
      name: "profile",
      component: Profile,
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
      path: "/orga/faq",
      name: "faq",
      component: Faq,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession();
  const currentUser = data.session?.user;
  console.log(currentUser);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  console.log(requiresAuth);
  if (requiresAuth && !currentUser) next("/login");
  //else if(!requiresAuth && currentUser) next("/orga");
  else next();
});

export default router;

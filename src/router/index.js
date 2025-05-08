import { createRouter, createWebHashHistory } from "vue-router";
import store from "@/store";
import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import ProfileLayout from "@/layouts/ProfileLayout.vue";

import AboutUs from "@/components/main/AboutUs.vue";
import RulesComp from "@/components/main/RulesComp.vue";
import HomePage from "@/components/HomePage.vue";
import CatalogPage from "@/components/CatalogPage.vue";
import BookDetails from "@/components/BookDetails.vue";
import LoginPage from "@/components/auth/LoginComp.vue";
import RegisterPage from "@/components/auth/RegisterComp.vue";
import ProfileComp from "@/components/profile/ProfileComp.vue";
import LikesComp from "@/components/profile/LikesComp.vue";
import BooksComp from "@/components/profile/BooksComp.vue";
import FinesComp from "@/components/profile/FinesComp.vue";
import AdminPanel from "@/components/admin/AdminPanel.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: HomePage,
        meta: { title: "Головна - Reread" },
      },
      {
        path: "about",
        name: "AboutUs",
        component: AboutUs,
        meta: { title: "Про нас - Reread" },
      },
      {
        path: "rules",
        name: "Rules",
        component: RulesComp,
        meta: { title: "Правила - Reread" },
      },
      {
        path: "/catalog",
        name: "Catalog",
        component: CatalogPage,
        meta: { title: "Каталог - Reread" },
      },
      {
        path: "/book/:id",
        name: "BookDetails",
        component: BookDetails,
        meta: { title: "Книга - Reread" },
      },
      {
        path: "/profile",
        component: ProfileLayout,
        children: [
          {
            path: "admin",
            component: AdminPanel,
            meta: {
              requiresAuth: true,
              requiresAdmin: true,
              title: "Адмін - Reread",
            },
            children: [
              {
                path: "users",
                component: () => import("@/components/admin/UsersPanel.vue"),
                meta: { title: "Користувачі" },
              },
              {
                path: "books",
                component: () => import("@/components/admin/BooksPanel.vue"),
                meta: { title: "Книги" },
              },
              {
                path: "reservation",
                component: () =>
                  import("@/components/admin/ReservationPanel.vue"),
                meta: { title: "Резервування" },
              },
              {
                path: "statistics",
                component: () =>
                  import("@/components/admin/StatisticsPanel.vue"),
                meta: { title: "Статистика" },
              },
            ],
          },
          {
            path: "info",
            component: ProfileComp,
            meta: { title: "Профіль - Reread" },
          },
          {
            path: "likes",
            component: LikesComp,
            meta: { title: "Уподобання - Reread" },
          },
          {
            path: "books_shelf",
            component: BooksComp,
            meta: { title: "Моя книжкова полиця - Reread" },
          },
          {
            path: "fines",
            component: FinesComp,
            meta: { title: "Штрафи - Reread" },
          },
          { path: "", redirect: "/profile/info" },
        ],
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "Login",
        component: LoginPage,
        meta: { title: "Вхід - Reread" },
      },
      {
        path: "register",
        name: "Register",
        component: RegisterPage,
        meta: { title: "Реєстрація - Reread" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.isAuthenticated;
  const isAdmin = store.state.isAdmin;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: "/auth/login" });
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next({ path: "/" });
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title || "Default Title";
});

export default router;

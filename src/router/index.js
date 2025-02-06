import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

import HomePage from "@/components/HomePage.vue";
import CatalogPage from "@/components/CatalogPage.vue";
import BookDetails from "@/components/BookDetails.vue";
import LoginPage from "@/components/auth/LoginComp.vue";
import RegisterPage from "@/components/auth/RegisterComp.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: HomePage,
        meta: { title: "Home - My Vue App" },
      },
      {
        path: "catalog",
        name: "Catalog",
        component: CatalogPage,
        meta: { title: "Catalog - My Vue App" },
      },
      {
        path: "book/:id",
        name: "BookDetails",
        component: BookDetails,
        meta: { title: "Book - My Vue App" },
      },
    ],
  },
  {
    path: "auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "Login",
        component: LoginPage,
        meta: { title: "Login - My Vue App" },
      },
      {
        path: "register",
        name: "Register",
        component: RegisterPage,
        meta: { title: "Register - My Vue App" },
      },
    ],
  },
  // {
  //   path: "/custom",
  //   component: CustomLayout,
  //   children: [{ path: "", name: "CustomPage", component: CustomPage }],
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  document.title = to.meta.title || "Default Title";
});

export default router;

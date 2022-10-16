const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: false },
    children: [
      {
        path: "",
        name: "home",
        component: () => import("src/pages/PageHome.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "",
        name: "table",
        component: () => import("src/pages/PageTable.vue"),
        meta: { requiresAuth: false },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/pages/PageError.vue"),
  },
];

export default routes;

import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

const token = () => {
  return store.state.user?.access_token;
};

const auth = (to, from, next) => {
  if (!token()) {
    next({ path: "/sign-in" });
    return;
  }
  next();
  return;
};

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/sign-in",
      name: "sign-in",
      component: () => import("../views/SignIn/SignIn.vue"),
    },
    {
      path: "/",
      name: "Home",
      beforeEnter: auth,
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/statistic",
      name: "Hisobotlar",
      beforeEnter: auth,
      component: () => import("../views/Statistic/Statistic.vue"),
    },
    {
      path: "/order",
      name: "Buyurtma",
      beforeEnter: auth,
      component: () => import("../views/Order/Order.vue"),
    },
    {
      path: "/user",
      name: "Hodim",
      beforeEnter: auth,
      component: () => import("../views/Users/User.vue"),
    },
    {
      path: "/users",
      name: "Hodimlar",
      beforeEnter: auth,
      component: () => import("../views/Users/Users.vue"),
    },
    {
      path: "/customers",
      name: "Mijozlar",
      beforeEnter: auth,
      component: () => import("../views/Customers/Customers.vue"),
    },
    {
      path: "/customer",
      name: "Mijoz",
      beforeEnter: auth,
      component: () => import("../views/Customers/Customer.vue"),
    },
    {
      path: "/expense",
      name: "Chiqim",
      beforeEnter: auth,
      component: () => import("../views/Expense/Expense.vue"),
    },
    {
      path: "/setting",
      name: "Sozlamalar",
      beforeEnter: auth,
      component: () => import("../views/Setting/Setting.vue"),
    },
  ],
});

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
      path: "/:catchAll(.*)",
      name: "not-found",
      component: () => import("../views/NotFound/NotFound.vue"),
    },
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
      path: "/branches",
      name: "Filiallar",
      beforeEnter: auth,
      component: () => import("../views/Branch/Branches.vue"),
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
      path: "/loans",
      name: "Nasiyalar",
      beforeEnter: auth,
      component: () => import("../views/Loan/Loans.vue"),
    },
    {
      path: "/loan",
      name: "Nasiya",
      beforeEnter: auth,
      component: () => import("../views/Loan/Loan.vue"),
    },
    {
      path: "/suppliers",
      name: "Ta'minotchilar",
      beforeEnter: auth,
      component: () => import("../views/Suppliers/Suppliers.vue"),
    },
    {
      path: "/supplier",
      name: "Ta'minotchi",
      beforeEnter: auth,
      component: () => import("../views/Suppliers/Supplier.vue"),
    },
    {
      path: "/parties",
      name: "Ta'minotlar",
      beforeEnter: auth,
      component: () => import("../views/Supply/Parties.vue"),
    },
    {
      path: "/party",
      name: "Ta'minot",
      beforeEnter: auth,
      component: () => import("../views/Supply/Party.vue"),
    },
    {
      path: "/products",
      name: "Mahsulotlar",
      beforeEnter: auth,
      component: () => import("../views/Product/Products.vue"),
    },
    {
      path: "/product",
      name: "Mahsulot",
      beforeEnter: auth,
      component: () => import("../views/Product/Product.vue"),
    },
    {
      path: "/revision",
      name: "Mahsulotlar qoldig'i",
      beforeEnter: auth,
      component: () => import("../views/Revision/Revision.vue"),
    },
    {
      path: "/return",
      name: "Mahsulot qaytarish",
      beforeEnter: auth,
      component: () => import("../views/Return/Return.vue"),
    },
    {
      path: "/setting",
      name: "Sozlamalar",
      beforeEnter: auth,
      component: () => import("../views/Setting/Setting.vue"),
    },
  ],
});

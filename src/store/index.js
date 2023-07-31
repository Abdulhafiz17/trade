import { createStore } from "vuex";
let loading_index = 0;

export default createStore({
  state() {
    return {
      user: JSON.parse(localStorage["user"] || null),
      loading: false,
      show_nav: false,
      color_theme: localStorage["color-theme"] || "light",
    };
  },
  actions: {
    setUser(ctx, user) {
      ctx.commit("setUser", user);
    },
    setLoading(ctx, loading) {
      ctx.commit("setLoading", loading);
    },
    toggleNav(ctx, nav) {
      ctx.commit("toggleNav", nav);
    },
    setColorTheme(ctx, theme) {
      ctx.commit("setColorTheme", theme);
    },
  },
  mutations: {
    setUser(state, user) {
      localStorage["user"] = JSON.stringify(user);
      state.user = user;
    },
    setLoading(state, loading) {
      if (loading) {
        state.loading = loading;
        loading_index++;
      } else {
        loading_index--;
        if (!loading_index) state.loading = loading;
      }
    },
    toggleNav(state, nav) {
      state.show_nav = nav;
    },
    setColorTheme(state, theme) {
      state.color_theme = theme;
      localStorage["color-theme"] = theme;
      document.documentElement.setAttribute("theme-color", theme);
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    loading(state) {
      return state.loading;
    },
    show_nav(state) {
      return state.show_nav;
    },
    color_theme(state) {
      return state.color_theme;
    },
  },
});

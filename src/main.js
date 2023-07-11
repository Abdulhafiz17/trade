import { createApp } from "vue";
import App from "./App.vue";
import Tab from "./components/Tab/Tab.vue";
import Modal from "./components/Modal/Modal.vue";
import Collapse from "./components/Collapse/Collapse.vue";
import "./style.scss";
import router from "./router/index";
import store from "./store/index";
import util from "./server/util";
// Bootstrap
import "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.0.1/js/bootstrap.min.js";

const app = createApp(App);

app.config.globalProperties.$util = util;

app
  .component("Tab", Tab)
  .component("Modal", Modal)
  .component("Collapse", Collapse)
  .use(router)
  .use(store)
  .mount("#app");

import { createApp } from "vue";
import App from "./App.vue";
import Tab from "./components/Tab/Tab.vue";
import Modal from "./components/Modal/Modal.vue";
import Collapse from "./components/Collapse/Collapse.vue";
import Dropdown from "./components/Dropdown/Dropdown.vue";
import DataDropdown from "./components/DataDropdown/DataDropdown.vue";
import "./style.scss";
import router from "./router/index";
import store from "./store/index";
import util from "./server/util";
import baseurl from "./server/baseurl";
// Bootstrap
import "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.0.1/js/bootstrap.min.js";

const app = createApp(App);

app.config.globalProperties.$util = util;
app.config.globalProperties.$baseurl = baseurl;

app
  .component("Tab", Tab)
  .component("Modal", Modal)
  .component("Collapse", Collapse)
  .component("Dropdown", Dropdown)
  .component("DataDropdown", DataDropdown)
  .use(router)
  .use(store)
  .mount("#app");

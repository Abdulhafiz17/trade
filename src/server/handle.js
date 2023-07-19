import util from "./util";
import router from "../router/index";
import store from "../store";

export default function handleError(error) {
  const status = error.response?.status;
  const detail = error.response?.data?.detail;
  if (status)
    if (status == 400) {
      util.toast("warning", detail);
    } else if (status == 401) {
      store.dispatch("setUser", null);
      router.push("/sign-in");
    }
}

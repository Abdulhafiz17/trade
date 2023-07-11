import util from "./util";
import router from "../router/index";

export default function handleError(error) {
  const status = error.response?.status;
  const detail = error.response?.data?.detail;
  if (status)
    if (status == 400) {
      util.toast("warning", detail);
    } else if (status == 401) {
      router.push("/sign-in");
    }
}

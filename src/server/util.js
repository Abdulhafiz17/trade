import Swal from "sweetalert2";

export default {
  payment_types: ["naqd", "plastik", "click"],
  currency(number = Number()) {
    return Intl.NumberFormat().format(Number(number).toFixed(2));
  },
  tel(number) {
    return String(
      "(" +
        String(number).substring(0, 2) +
        ") " +
        String(number).substring(2, 5) +
        " " +
        String(number).substring(5, 7) +
        " " +
        String(number).substring(7, 9)
    );
  },
  captalize(text = String()) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
  toast(icon = "success", title = "Amaliyot bajarildi !") {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    return Toast.fire({
      icon: icon,
      title: title,
    });
  },
  formData: (object) =>
    Object.entries(object).reduce((fd, [key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((v) => fd.append(key, v));
      } else {
        fd.append(key, val);
      }
      return fd;
    }, new FormData()),
};

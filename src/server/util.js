import Swal from "sweetalert2";

export default {
  payment_types: ["naqd", "plastik", "click"],
  units: ["dona", "kg", "litr", "metr"],
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
  countDays(start, end) {
    let start_date = start ? new Date(start) : new Date(),
      end_date = new Date(end),
      difference = end_date.getTime() - start_date.getTime(),
      days = Math.ceil(difference / (1000 * 3600 * 24));
    return days;
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

<script>
import api from "../../server/api";
export default {
  name: "Revision",
  data() {
    return {
      products_waiting: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      products_counted: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      products_not_equal: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
};
</script>

<template>
  <div class="row gap-3">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">MAHSULOTLAR QOLDIG'I</h2>
        </div>
        <div class="col-md-6"></div>
      </div>
    </div>
    <div class="col-12">
      <div class="d-flex gap-1">
        <button
          class="btn btn-primary"
          v-if="!products_waiting.data.length && !products_counted.data.length"
        >
          Tekshiruv qo'shish
        </button>
        <button
          class="btn btn-danger"
          v-if="products_waiting.data.length && !products_counted.data.length"
        >
          Tekshiruv yakunlash
        </button>
        <button
          class="btn btn-success"
          v-if="
            products_waiting.data.length
              ? false
              : products_counted.data.length
              ? true
              : false
          "
        >
          Tekshiruv tasdiqlash
        </button>
      </div>
    </div>
  </div>
</template>

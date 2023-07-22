<script>
import api from "../../server/api";
import Order from "../../components/Order/Order.vue";
import Trades from "../../components/Order/Trades.vue";
export default {
  name: "Return",
  components: { Order, Trades },
  data() {
    return {
      order_id: null,
    };
  },
  methods: {
    get() {
      this.$refs.order.getOrder();
      this.$refs.trades.getTrades();
    },
  },
};
</script>

<template>
  <div class="row gap-3">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">MAHSULOT QAYTARISH</h2>
        </div>
        <div class="col-md-6"></div>
      </div>
    </div>
    <div class="col-12">
      <Tab :tabs="[`Mahsulot qaytarish`, `Qaytarilgan mahsulotlar`]">
        <template #1>
          <div class="row gap-2">
            <div class="col-4">
              <form class="input-group" @submit.prevent="get()">
                <input
                  type="number"
                  class="form-control"
                  placeholder="order id:"
                  required
                  v-model="order_id"
                />
                <div class="input-group-append">
                  <button class="btn btn-primary">
                    <img
                      src="../../assets/icons/Search_alt.svg"
                      alt="Search_alt"
                    />
                  </button>
                </div>
              </form>
            </div>
            <div class="col-12">
              <Order :order-id="order_id" ref="order" />
              <Trades :order-id="order_id" ref="trades" />
            </div>
          </div>
        </template>
      </Tab>
    </div>
  </div>
</template>

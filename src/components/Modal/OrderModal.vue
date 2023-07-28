<script>
import Order from "../Order/Order.vue";
import Trade from "../Order/Trades.vue";
import Receipt from "../Order/Receipt.vue";
export default {
  name: "OrderModal",
  components: { Order, Trade, Receipt },
  props: {
    printable: Boolean,
    returnable: Boolean,
  },
  data() {
    return {
      order_id: 0,
    };
  },
  methods: {
    start(order_id) {
      this.order_id = order_id;
      this.$refs.orderModal.openModal();
    },
    routerToReturn() {
      this.$router.push({
        path: "/return",
        query: { order_id: this.order_id },
      });
    },
  },
};
</script>

<template>
  <Modal size="lg" ref="orderModal">
    <template #body>
      <Order :order-id="order_id" />
      <Trade :order-id="order_id" />
    </template>
    <template #footer>
      <div class="d-flex gap-1 justify-content-end">
        <button
          class="btn btn-outline-primary"
          @click="$refs.receipt.start(order_id)"
          v-if="printable"
        >
          <i class="fa fa-print"></i>
        </button>
        <button
          class="btn btn-outline-info"
          @click="routerToReturn()"
          v-if="returnable"
        >
          <i class="fa fa-undo"></i>
        </button>
      </div>
    </template>
  </Modal>

  <Receipt :order-id="order_id" ref="receipt" />
</template>

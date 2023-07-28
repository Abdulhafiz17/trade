<script>
import Order from "../Order/Order.vue";
import Trade from "../Order/Trades.vue";
export default {
  name: "OrderModal",
  components: { Order, Trade },
  props: {
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
      <button class="btn btn-outline-info" @click="routerToReturn()">
        <i class="fa fa-undo"></i>
      </button>
    </template>
  </Modal>
</template>

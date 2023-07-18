<script>
import api from "../../server/api";
export default {
  name: "Order",
  props: {
    id: Number,
  },
  data() {
    return {
      order: null,
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.getOrder();
    this.getBalance();
  },
  methods: {
    getOrder() {
      const param = {
        branch_id: 0,
        order_id: this.$props.id,
        seller_id: 0,
        user_id: 0,
        customer_id: 0,
        status: "",
        from_time: "",
        to_time: "",
        page: 0,
        limit: 1,
      };
      api.get_orders(param).then((res) => {
        this.order = res.data;
      });
    },
    getBalance() {
      api
        .get_trades({
          order_id: this.$props.id,
          branch_id: this.current_user.branch_id,
        })
        .then((res) => {
          this.order.balance = res.data.order_balance;
        });
    },
  },
};
</script>

<template>
  <div class="order">
    <div class="row">
      <div class="col-md">
        <p>Buyurtma balansi:</p>
        <strong>{{ $util.currency(order?.balance) }} so'm</strong>
      </div>
      <div class="col-md">
        <p>Chegirma balansi:</p>
        <strong>{{ $util.currency(order?.Orders?.discount) }} so'm</strong>
      </div>
      <div class="col-md" v-if="order?.Customers">
        <p>Mijoz</p>
        <strong>{{ order?.Customers?.name }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order {
  padding: 1rem;
}
</style>

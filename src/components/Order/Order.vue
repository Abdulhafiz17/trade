<script>
import api from "../../server/api";
export default {
  name: "Order",
  props: {
    orderId: Number,
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
    id() {
      return this.$props.orderId;
    },
  },
  created() {
    this.getOrder();
  },
  methods: {
    getOrder() {
      const param = {
        branch_id: 0,
        order_id: this.id,
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
        this.getBalance();
        this.getIncomes();
      });
    },
    getBalance() {
      const param = {
        order_id: this.id,
        branch_id: this.current_user.branch_id,
      };
      api.get_trades(param).then((res) => {
        this.order.balance = res.data.order_balance;
      });
    },
    getIncomes() {
      const param = {
        source: this.id,
        status: "order",
        page: 0,
        limit: 25,
      };
      api.get_incomes(param).then((res) => {
        this.order.incomes = res.data.data;
      });
    },
  },
};
</script>

<template>
  <div class="order">
    <div class="row">
      <div class="col-md">
        <p>Buyurtma balansi</p>
        <strong>{{ $util.currency(order?.balance) }} so'm</strong>
      </div>
      <div class="col-md">
        <p>Chegirma balansi</p>
        <strong>{{ $util.currency(order?.Orders?.discount) }} so'm</strong>
      </div>
      <div class="col-md" v-if="order?.incomes?.length">
        <p>To'lov</p>
        <strong
          v-for="item in order?.incomes"
          :key="item"
          v-show="item.Incomes.money"
        >
          {{ $util.currency(item.Incomes.money) }}
          so'm
          {{ item.Incomes.type }}
          <br />
        </strong>
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

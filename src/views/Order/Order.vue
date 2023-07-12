<script>
import api from "../../server/api";
import Orders from "./Orders.vue";
import Trades from "./Trades.vue";
export default {
  name: "Order",
  components: { Orders, Trades },
  data() {
    return {
      order: null,
      orders: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      balance: null,
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.getOrders();
  },
  methods: {
    getOrders() {
      const param = {
        branch_id: this.current_user?.branch_id,
        order_id: 0,
        seller_id: 0,
        user_id: 0,
        customer_id: 0,
        status: "false",
        from_time: "",
        to_time: "",
        page: 0,
        limit: 25,
      };
      api.get_orders(param).then((res) => {
        this.orders = res.data;
        if (res.data.data.length) this.order = res.data.data[0];
        else this.order = null;
        this.$refs.trades.getTrades();
      });
    },
    changeOrder() {
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
          <h2 class="title">KASSA</h2>
        </div>
        <div class="col-md-6">
          <Orders
            ref="orders"
            v-model:order="order"
            :orders="orders"
            @update:order="
              $nextTick(() => {
                changeOrder();
              })
            "
          />
        </div>
      </div>
    </div>
    <div class="col-12">
      <Trades ref="trades" :order="order" />
    </div>
    <div class="col-12">
      <div class="order">
        <h4 v-if="order">
          <span class="number">{{ order.Orders.ordinal_number }}</span>
          Buyurtma
        </h4>
        <div>
          <strong class="balance">
            {{ $util.currency(balance) + " so'm" }}
          </strong>
          <button class="btn-group p-0 btn btn-outline-light">
            <span class="btn-sm text-success">Tasdiqlash</span>
            <span class="btn-sm bg-success">
              <img src="../../assets/icons/Done_all_round.svg" alt="" />
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
* {
  vertical-align: middle;
}
.order {
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-color: rgb(235, 235, 235);
  border-radius: 5px;

  &:first-child {
    text-align: left;
  }

  &:last-child {
    text-align: right;
  }

  h4 {
    margin: 0;
  }

  .number {
    padding: 5px 1rem;
    color: white;
    background-color: var(--red);
    border-radius: 5px;
  }

  .balance {
    padding: 0 1rem;
  }
  .btn-group {
    background-color: white;
    border-radius: 10px;

    .text-success {
      font-weight: 700;
    }

    .bg-success {
      border-top-left-radius: 0;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 0;
    }
  }
}
</style>

<script>
import api from "../../server/api";
import Order from "../../components/Order/Order.vue";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "OrderHistory",
  components: { Pagination, Order },
  data() {
    return {
      filter: {
        from_time: "",
        to_time: "",
      },
      orders: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
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
        branch_id: this.current_user.branch_id,
        order_id: 0,
        seller_id: 0,
        user_id: 0,
        customer_id: 0,
        status: "true",
        from_time: this.filter.from_time,
        to_time: this.filter.to_time,
        page: this.orders.current_page,
        limit: this.orders.limit,
      };
      api.get_orders(param).then((res) => {
        this.orders = res.data;
      });
    },
  },
};
</script>

<template>
  <div class="row gap-2">
    <div class="col-12">
      <div class="row">
        <div class="col-md-5 mb-1">
          <input type="date" class="form-control" v-model="filter.from_time" />
        </div>
        <div class="col-md-5 mb-1">
          <input type="date" class="form-control" v-model="filter.to_time" />
        </div>
        <div class="col-md-2">
          <button class="btn w-100 btn-primary" @click="getOrders()">
            <img src="../../assets/icons/Search_alt.svg" alt="Search_alt" />
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="row gap-1 table-responsive" style="max-height: 62vh">
        <div class="col-12 item" v-for="item in orders.data" :key="item">
          <div class="flex cursor" :toggle-collapse="'order' + item.Orders.id">
            <span>{{ "Buyurtma id: " + item.Orders.id }}</span>
            <span>{{
              item.Orders.time.replace("T", " ").substring(0, 16)
            }}</span>
          </div>
          <Collapse :id="'order' + item.Orders.id" v-model:open="item.open">
            <div class="order">
              <Order :id="item.Orders.id" />
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  height: auto !important;
}

.item {
  border: thin solid whitesmoke;
  border-radius: 10px;
}

.flex {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order {
  background-color: whitesmoke;
  border-radius: 10px;
}
</style>

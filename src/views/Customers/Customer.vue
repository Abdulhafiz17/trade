<script>
import api from "../../server/api";
import EditCustomer from "./EditCustomer.vue";
import OrderHistory from "../../components/Order/OrderHistory.vue";
export default {
  name: "Customer",
  components: { EditCustomer, OrderHistory },
  data() {
    return {
      customer_id: this.$route.query.customer_id,
      content: this.$route.query.content,
      customer: {
        phone: 0,
        id: 0,
        type: "",
        branch_id: 0,
        user_id: 0,
        name: "",
      },
    };
  },
  created() {
    this.get();
  },
  methods: {
    get() {
      api.get_customer({ customer_id: this.customer_id }).then((res) => {
        this.customer = res.data;
      });
    },
  },
};
</script>

<template>
  <div class="row gap-3">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">MIJOZ</h2>
        </div>
        <div class="col-md-6">
          <button
            class="btn btn-sm btn-primary float-end"
            @click="$router.go(-1)"
          >
            ⇽
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <EditCustomer :customer="customer" v-if="content == 'edit'" />
      <OrderHistory from="customer" v-if="content == 'history'" />
    </div>
  </div>
</template>

<style scoped>
button {
  height: auto;
}
</style>

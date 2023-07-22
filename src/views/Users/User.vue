<script>
import api from "../../server/api";
import EditUser from "./EditUser.vue";
import PaymentHistory from "./PaymentHistory.vue";
import OrderHistory from "../../components/Order/OrderHistory.vue";
export default {
  name: "User",
  components: { EditUser, PaymentHistory, OrderHistory },
  data() {
    return {
      user_id: this.$route.query.user_id,
      content: this.$route.query.content,
      user: {
        username: "",
        token: "",
        id: 0,
        phone: 0,
        status: true,
        password_hash: "",
        name: "",
        role: "",
        branch_id: 1,
        balance: false,
      },
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      api.this_user({ user_id: this.user_id }).then((res) => {
        this.user = res.data;
        this.user.password = "";
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
          <h2 class="title">HODIM</h2>
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
    <div class="col-12" v-if="content == 'edit'">
      <EditUser :user="user" />
    </div>
    <div class="col-12" v-if="content == 'history'">
      <Tab :tabs="[`To'lovlar`, `Buyurtmalar`]">
        <template #1>
          <PaymentHistory />
        </template>
        <template #2>
          <OrderHistory from="user" />
        </template>
      </Tab>
    </div>
  </div>
</template>

<style scoped>
button {
  height: auto;
}
</style>

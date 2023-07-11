<script>
import api from "../../server/api";
import EditUser from "./EditUser.vue";
export default {
  name: "User",
  components: { EditUser },
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
    <div class="col-12">
      <EditUser :user="user" v-if="content == 'edit'" />
    </div>
  </div>
</template>

<style scoped>
button {
  height: auto;
}
</style>

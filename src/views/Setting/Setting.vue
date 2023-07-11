<script>
import api from "../../server/api";
import EditUser from "../Users/EditUser.vue";
import Currencies from "./Currencies.vue";
import Categories from "./Categories.vue";
import ProductTypes from "./ProductTypes.vue";
export default {
  name: "Setting",
  components: { EditUser, Currencies, Categories, ProductTypes },
  data() {
    return {
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
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      const param = {
        user_id: this.current_user.id,
      };
      api.this_user(param).then((res) => {
        this.user = res.data;
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
          <h2 class="title">SOZLAMALAR</h2>
        </div>
        <div class="col-md-6">
          <button
            class="btn btn-sm btn-primary float-end"
            @click="$router.push('/sign-in')"
          >
            Tizimdan chiqish
            <img
              src="../../assets/icons/Sign_out_squre.svg"
              alt="Sign_out_squre"
            />
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <Tab
        :tabs="[`Profil`, `Valyutalar`, `Kategoriyalar`, `Mahsulot turlari`]"
      >
        <template #1>
          <EditUser :user="user" />
        </template>
        <template #2>
          <Currencies />
        </template>
        <template #3>
          <Categories />
        </template>
        <template #4>
          <ProductTypes />
        </template>
      </Tab>
    </div>
  </div>
</template>

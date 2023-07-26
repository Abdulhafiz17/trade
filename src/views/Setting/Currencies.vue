<script>
import api from "../../server/api";
export default {
  name: "Currencies",
  data() {
    return {
      currency: {
        currency: "",
        price: null,
      },
      currencies: [],
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.get();
  },
  methods: {
    get() {
      api.get_currencies().then((res) => {
        this.currencies = res.data;
      });
    },
    post() {
      api.create_currency(this.currency).then(() => {
        this.$util.toast().then(() => {
          this.currency = {
            currency: "",
            price: null,
          };
          this.get();
        });
      });
    },
    put(item) {
      api.update_currency(item).then(() => {
        this.$util.toast().then(() => {
          this.get();
        });
      });
    },
  },
};
</script>

<template>
  <main>
    <h5>Valyutalar</h5>
    <p>Yangi valyuta qo'shish yoki mavjud valyuta ma'lumotini tahrirlash</p>
    <div class="row gap-2 table-responsive" style="max-height: 55vh">
      <div class="col-12" v-if="current_user.role == 'branch_admin'">
        <form class="input-group" @submit.prevent="post()">
          <div class="input-group-text">1</div>
          <input
            type="text"
            class="form-control"
            placeholder="nomi"
            required
            v-model="currency.currency"
          />
          <div class="input-group-text">=</div>
          <input
            type="number"
            min="0"
            step="any"
            class="form-control"
            placeholder="narxi"
            required
            v-model="currency.price"
          />
          <div class="input-group-text">so'm</div>
          <div class="input-group-append">
            <button class="btn btn-primary">
              <img src="../../assets/icons/Add_ring.svg" alt="Add_ring" />
            </button>
          </div>
        </form>
      </div>
      <div class="col-12" v-for="item in currencies" :key="item">
        <form class="input-group" @submit.prevent="put(item)">
          <div class="input-group-text">1</div>
          <input
            type="text"
            class="form-control"
            placeholder="nomi"
            required
            :disabled="current_user.role !== 'branch_admin'"
            v-model="item.currency"
          />
          <div class="input-group-text">=</div>
          <input
            type="number"
            min="0"
            step="any"
            class="form-control"
            placeholder="narxi"
            required
            :disabled="current_user.role !== 'branch_admin'"
            v-model="item.price"
          />
          <div class="input-group-text">so'm</div>
          <div class="input-group-append">
            <button
              class="btn btn-success"
              v-if="current_user.role == 'branch_admin'"
            >
              <img src="../../assets/icons/Done_round.svg" alt="Add_ring" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
}
</style>

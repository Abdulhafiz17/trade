<script>
import api from "../../server/api";
export default {
  name: "EditSupplier",
  props: {
    supplier: null,
  },
  methods: {
    put() {
      api.update_market(this.$props.supplier).then(() => {
        this.$util.toast();
      });
    },
  },
};
</script>

<template>
  <main>
    <h5>Shaxsiy ma'lumotlar</h5>
    <p>Ism, telefon raqami yoki manzilni o'zgartirish</p>
    <form class="row gap-3" @submit.prevent="put()">
      <div class="col-12">
        <div class="row">
          <label class="col-md-6">
            Ism
            <input
              type="text"
              class="form-control"
              placeholder="Ism:"
              required
              v-model="supplier.name"
            />
          </label>
          <label class="col-md-6">
            Tel
            <div class="input-group">
              <div class="input-group-text">+998</div>
              <input
                type="tel"
                class="form-control"
                placeholder="Tel:"
                required
                v-model="supplier.phone"
              />
            </div>
          </label>
        </div>
      </div>
      <label class="col-12">
        Manzil
        <input
          type="text"
          class="form-control"
          placeholder="Manzil:"
          required
          v-model="supplier.address"
        />
      </label>
      <div class="col-12">
        <button class="btn-group p-0 btn btn-outline-light">
          <span class="btn-sm text-success">Tasdiqlash</span>
          <span class="btn-sm bg-success">
            <img src="../../assets/icons/Done_all_round.svg" alt="" />
          </span>
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
  border: thin solid whitesmoke;
  border-radius: 10px;
}

.btn-group {
  border-radius: 10px;
}

.text-success {
  font-weight: 700;
}

.bg-success {
  border-top-left-radius: 0;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 0;
}
</style>

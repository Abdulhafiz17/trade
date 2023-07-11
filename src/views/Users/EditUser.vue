<script>
import api from "../../server/api";
export default {
  name: "EditUser",
  props: {
    user: null,
  },
  methods: {
    put() {
      api.update_user(this.$props.user).then(() => {
        this.$util.toast();
      });
    },
  },
};
</script>

<template>
  <main :class="{ border: $route.name == 'Hodim' }">
    <h5>Shaxsiy ma'lumotlar</h5>
    <p>Ism, telefon raqami, foydalanuvchi nomi yoki parolni o'zgartirish</p>
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
              v-model="user.name"
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
                v-model="user.phone"
              />
            </div>
          </label>
        </div>
      </div>
      <div class="col-12">
        <div class="row">
          <label class="col-md-12">
            Status
            <select class="form-select" v-model="user.status">
              <option :value="true">Faol</option>
              <option :value="false">Nofaol</option>
            </select>
          </label>
        </div>
      </div>
      <div class="col-12">
        <div class="row">
          <label class="col-md-6">
            Foydalanuvchi nomi
            <input
              type="text"
              class="form-control"
              placeholder="Foydalanuvchi nomi:"
              required
              v-model="user.username"
            />
          </label>
          <label class="col-md-6">
            Parol
            <input
              type="password"
              class="form-control"
              placeholder="Parol:"
              v-model="user.password"
            />
          </label>
        </div>
      </div>
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
  border: thin solid transparent;
  border-radius: 10px;
}

main.border {
  border-color: whitesmoke;
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

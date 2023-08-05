<script>
import api from "../../server/api";
export default {
  name: "AddUser",
  emits: {
    end: null,
  },
  data() {
    return {
      user: {
        id: 0,
        name: "",
        username: "",
        password: "",
        role: "",
        phone: null,
        branch_id: 0,
        status: true,
      },
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
    title() {
      return this.current_user.role == "crud_admin" ? "Admin" : "Hodim";
    },
  },
  methods: {
    open() {
      this.user = {
        id: 0,
        name: "",
        username: "",
        password: "",
        role: "",
        phone: null,
        branch_id: 0,
        status: true,
      };
      this.$refs.addUserModal.openModal();
    },
    postUser() {
      if (this.current_user.role == "admin")
        this.user.branch_id = this.$route.query.branch_id;
      api.create_user(this.user).then(() => {
        this.user = {
          id: 0,
          name: "",
          username: "",
          password: "",
          role: "",
          phone: null,
          branch_id: 0,
          status: true,
        };
        this.$util.toast().then(() => {
          this.$emit("end");
          this.$refs.addUserModal.closeModal();
        });
      });
    },
  },
};
</script>

<template>
  <Modal ref="addUserModal">
    <template #header>
      <h5>{{ title }} qo'shish</h5>
    </template>
    <template #body>
      <form class="row gap-2" id="add-user-form" @submit.prevent="postUser()">
        <label class="col-12">
          Ism
          <input type="text" class="form-control" required v-model="user.name" />
        </label>
        <label class="col-12">
          Telfon raqam
          <div class="input-group" :tel="$util.tel(user.phone)">
            <div class="input-group-text">+998</div>
            <input type="tel" class="form-control" minlength="9" maxlength="9" required v-model="user.phone" />
          </div>
        </label>
        <label class="col-12">
          Vazifa
          <select class="form-select" required v-model="user.role">
            <option value="admin" v-if="current_user.role == 'crud_admin'">
              Admin
            </option>
            <option value="branch_admin" v-if="current_user.role == 'admin'">
              Filial admin
            </option>
            <option value="seller" v-if="current_user.role == 'branch_admin'">
              Sotuvchi
            </option>
          </select>
        </label>
        <div class="col-12">
          <div class="row">
            <label class="col-6">
              Foydalanuvchi nomi
              <input type="text" class="form-control" minlength="5" required v-model="user.username" />
            </label>
            <label class="col-6">
              Parol
              <input type="password" class="form-control" required v-model="user.password" />
            </label>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button class="btn btn-success" form="add-user-form">
        <img src="../../assets/icons/Done_round-white.svg" alt="Done_round-white" />
      </button>
    </template>
  </Modal>
</template>

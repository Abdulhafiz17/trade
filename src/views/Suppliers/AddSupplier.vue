<script>
import api from "../../server/api";
export default {
  name: "AddSupplier",
  emits: {
    end: null,
  },
  data() {
    return {
      supplier: {
        id: 0,
        name: "",
        username: "",
        address: "",
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
  },
  methods: {
    open() {
      this.supplier = {
        id: 0,
        name: "",
        username: "",
        address: "",
        role: "",
        phone: null,
        branch_id: 0,
        status: true,
      };
      this.$refs.addSupplierModal.openModal();
    },
    postSupplier() {
      api.create_market(this.supplier).then(() => {
        this.supplier = {
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
          this.$refs.addSupplierModal.closeModal();
        });
      });
    },
  },
};
</script>

<template>
  <Modal ref="addSupplierModal">
    <template #header>
      <h5>Ta'minotchi qo'shish</h5>
    </template>
    <template #body>
      <form
        class="row gap-2"
        id="add-supplier-form"
        @submit.prevent="postSupplier()"
      >
        <label class="col-12">
          Ism
          <input
            type="text"
            class="form-control"
            required
            v-model="supplier.name"
          />
        </label>
        <label class="col-12">
          Telfon raqam
          <div class="input-group" :tel="$util.tel(supplier.phone)">
            <div class="input-group-text">+998</div>
            <input
              type="tel"
              class="form-control"
              minlength="9"
              maxlength="9"
              required
              v-model="supplier.phone"
            />
          </div>
        </label>
        <label class="col-12">
          Manzil
          <input
            type="text"
            class="form-control"
            required
            v-model="supplier.address"
          />
        </label>
      </form>
    </template>
    <template #footer>
      <button class="btn btn-success" form="add-supplier-form">
        <img
          src="../../assets/icons/Done_round-white.svg"
          alt="Done_round-white"
        />
      </button>
    </template>
  </Modal>
</template>

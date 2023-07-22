<script>
import api from "../../server/api";
export default {
  name: "BranchModal",
  emits: {
    end: null,
  },
  data() {
    return {
      branch_id: 0,
      branch: {
        name: "",
        phone: "",
        map_long: "",
        map_lat: "",
        address: "",
        file: "",
      },
      content: "admin",
      status: {
        branch_id: 0,
        status: true,
        active_date: "",
      },
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    start(id) {
      this.content = "admin";
      this.branch_id = id;
      if (this.branch_id) {
        this.getBranch();
      } else {
        this.branch = {
          name: "",
          phone: "",
          map_long: "",
          map_lat: "",
          address: "",
          file: "",
        };
        this.$refs.branchModal.openModal();
      }
    },
    getBranch() {
      api.get_branch({ branch_id: this.branch_id }).then((res) => {
        this.branch = {
          name: res.data.Branches.name,
          phone: res.data.Branches.phone,
          map_long: res.data.Branches.map_long,
          map_lat: res.data.Branches.map_lat,
          address: res.data.Branches.address,
          file: res.data.file,
        };
        this.status = {
          branch_id: res.data.Branches.id,
          status: res.data.Branches.status,
          active_date: res.data.Branches.active_date,
        };
        this.$refs.branchModal.openModal();
      });
    },
    sendData() {
      if (this.content == "admin") {
        let request = "";
        if (this.branch_id) {
          request = "update_branch";
          this.branch.id = this.branch_id;
        } else {
          request = "create_branch";
        }
        this.branch.file = document.querySelector(`[branch-file]`).files[0];
        api[request](this.branch).then(() => {
          this.$util.toast().then(() => {
            document.querySelector(`[branch-file]`).value = null;
            this.$refs.branchModal.closeModal();
            this.$emit("end");
          });
        });
      } else {
        api.update_branch_status(this.status).then(() => {
          this.$util.toast().then(() => {
            this.$refs.branchModal.closeModal();
            this.$emit("end");
          });
        });
      }
    },
  },
};
</script>

<template>
  <Modal ref="branchModal">
    <template #header>
      <h5>Filial qo'shish</h5>
    </template>
    <template #body>
      <form class="row gap-2" id="branch-form" @submit.prevent="sendData()">
        <div
          class="col-12"
          v-if="branch_id && current_user.role == 'crud_admin'"
        >
          <div class="row">
            <div class="col-6">
              <button
                type="button"
                class="btn btn-light w-100"
                :class="{ 'text-white bg-primary': content == 'admin' }"
                @click="content = 'admin'"
              >
                Umumiy
              </button>
            </div>
            <div class="col-6">
              <button
                type="button"
                class="btn btn-light w-100"
                :class="{ 'text-white bg-primary': content == 'crud_admin' }"
                @click="content = 'crud_admin'"
              >
                Status
              </button>
            </div>
          </div>
        </div>
        <div class="col-12" v-if="content == 'admin'">
          <div class="row gap-2">
            <label class="col-12">
              Nomi
              <input
                type="text"
                class="form-control"
                required
                v-model="branch.name"
              />
            </label>
            <label class="col-12">
              Telefon raqami
              <div class="input-group" :tel="$util.tel(branch.phone)">
                <div class="input-group-text">+998</div>
                <input
                  type="tel"
                  class="form-control"
                  minlength="9"
                  maxlength="9"
                  required
                  v-model="branch.phone"
                />
              </div>
            </label>
            <label class="col-12">
              Manzili
              <input
                type="text"
                class="form-control"
                required
                v-model="branch.address"
              />
            </label>
            <label class="col-12">
              Geo joylashuvi
              <div class="row">
                <div class="col-6">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      v-model="branch.map_long"
                    />
                    <div class="input-group-text">uzunlik</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      v-model="branch.map_lat"
                    />
                    <div class="input-group-text">kenglik</div>
                  </div>
                </div>
              </div>
            </label>
            <label class="col-12">
              File
              <input
                type="file"
                branch-file
                class="form-control"
                accept="image/*"
              />
            </label>
          </div>
        </div>
        <div class="col-12" v-if="content == 'crud_admin'">
          <div class="row gap-2">
            <div class="col-12">
              <select class="form-select" required v-model="status.status">
                <option :value="true">Faol</option>
                <option :value="false">Nofaol</option>
              </select>
            </div>
            <div class="col-12">
              <input
                type="date"
                class="form-control"
                required
                v-model="status.active_date"
              />
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button class="btn btn-success" form="branch-form">
        <img
          src="../../assets/icons/Done_round-white.svg"
          alt="Done_round-white"
        />
      </button>
    </template>
  </Modal>
</template>

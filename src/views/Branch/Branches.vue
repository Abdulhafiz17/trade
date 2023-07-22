<script>
import api from "../../server/api";
import BranchModal from "../../components/Modal/BranchModal.vue";
export default {
  name: "Branches",
  components: { BranchModal },
  data() {
    return {
      search: "",
      status: true,
      branches: [],
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
    admin_id() {
      if (this.current_user.role == "admin") return this.current_user.id;
      else return this.$route.query.admin_id || 0;
    },
  },
  created() {
    this.getBranches();
  },
  methods: {
    getBranches() {
      const param = {
        status: this.status,
        admin_id: this.admin_id,
      };
      api.get_branches(param).then((res) => {
        this.branches = res.data;
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
          <h2 class="title">FILIALLAR</h2>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-4 mb-1">
              <button
                class="btn btn-success w-100"
                @click="$refs.branchModal.start()"
                v-if="current_user.role !== 'crud_admin'"
              >
                <span>Filial qo'shish</span>
              </button>
            </div>
            <div class="col-md-6 mb-1">
              <input
                type="search"
                class="form-control"
                placeholder="Qidiruv:"
                v-model="search"
              />
            </div>
            <div class="col-md-2 mb-1">
              <button
                class="btn w-100 px-1"
                :class="{ 'btn-success': status, 'btn-danger': !status }"
                @click="
                  status = !status;
                  getBranches();
                "
              >
                {{ status ? "Faol" : "Nofaol" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="row">
        <div class="col-md-4" v-for="item in branches" :key="item">
          <div class="card">
            <div class="card-img">
              <img
                :src="$baseurl + '/uploaded_files/' + item.file"
                :alt="item.file"
                v-if="item.file"
              />
              <i class="fa fa-5x fa-file-image" v-else></i>
            </div>
            <div class="card-body">
              <div class="row gap-1">
                <div class="col-12">
                  <div class="flex">
                    <p>
                      <i class="fa fa-code-branch"></i>
                      {{ item.Branches.name }}
                    </p>
                    <p>
                      <i class="fa fa-location-dot"></i>
                      {{ item.Branches.address }}
                    </p>
                    <p>
                      <i class="fa fa-phone"></i>
                      <a :href="'tel:+998' + item.Branches.phone">
                        {{ "+998 " + $util.tel(item.Branches.phone) }}
                      </a>
                    </p>
                    <p>
                      <i class="fa fa-calendar-alt"></i>
                      {{ item.Branches.active_date }}
                      <strong
                        class="fw-bold"
                        :class="{
                          'text-success':
                            $util.countDays(
                              new Date(),
                              item.Branches.active_date
                            ) > 10,
                          'text-warning':
                            $util.countDays(
                              new Date(),
                              item.Branches.active_date
                            ) <= 10 &&
                            $util.countDays(
                              new Date(),
                              item.Branches.active_date
                            ) > 5,
                          'text-danger':
                            $util.countDays(
                              new Date(),
                              item.Branches.active_date
                            ) <= 5,
                        }"
                        v-if="
                          $util.countDays(
                            new Date(),
                            item.Branches.active_date
                          ) > 0
                        "
                      >
                        {{
                          $util.countDays(new Date(), item.Branches.active_date)
                        }}
                        kun
                      </strong>
                    </p>
                    <p v-if="current_user.role == 'crud_admin'">
                      <i class="fa fa-user"></i>
                      {{ item.Users.name }}
                    </p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row">
                    <div
                      class="col mb-1"
                      v-if="current_user.role !== 'crud_admin'"
                    >
                      <RouterLink
                        class="btn btn-sm btn-success w-100"
                        :to="{
                          path: '/statistic',
                          query: { branch_id: item.Branches.id },
                        }"
                      >
                        <img src="../../assets/icons/Pipe.svg" alt="Pipe" />
                      </RouterLink>
                    </div>
                    <div
                      class="col mb-1"
                      v-if="current_user.role !== 'crud_admin'"
                    >
                      <RouterLink
                        class="btn btn-sm btn-primary w-100"
                        :to="{
                          path: '/users',
                          query: { branch_id: item.Branches.id },
                        }"
                      >
                        <img
                          src="../../assets/icons/User_boxwhite.svg"
                          alt="User_boxwhite"
                        />
                      </RouterLink>
                    </div>
                    <div
                      class="col mb-1"
                      v-if="current_user.role !== 'crud_admin'"
                    >
                      <RouterLink
                        class="btn btn-sm btn-info w-100"
                        :to="{
                          path: '/products',
                          query: { branch_id: item.Branches.id },
                        }"
                      >
                        <img
                          src="../../assets/icons/Widget_add.svg"
                          alt="Widget_add"
                        />
                      </RouterLink>
                    </div>
                    <div class="col mb-1">
                      <button
                        class="btn btn-sm btn-warning w-100"
                        @click="$refs.branchModal.start(item.Branches.id)"
                      >
                        <img src="../../assets/icons/Edit.svg" alt="Edit" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BranchModal @end="getBranches()" ref="branchModal" />
</template>

<style scoped lang="scss">
.card {
  height: 100%;
  .card-img {
    padding: 1rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 80%;
    }
  }

  .card-body {
    .flex {
      display: flex;
      flex-direction: column;
      gap: 5px;
      p {
        .fa {
          color: black;
        }
      }
    }
  }
}
</style>

<script>
import api from "../../server/api";
import Pagination from "../../components/Pagination/Pagination.vue";
import AddUser from "../../components/Modal/AddUser.vue";
export default {
  name: "Users",
  components: { Pagination, AddUser },
  data() {
    return {
      search: "",
      users: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
    branch_id() {
      return this.$route.query.branch_id || this.current_user.branch_id;
    },
    title() {
      return this.current_user.role == "crud_admin" ? "Admin" : "Hodim";
    },
  },
  created() {
    this.get();
  },
  methods: {
    get() {
      const param = {
        branch_id: this.branch_id,
        search: this.search,
        page: this.users.current_page,
        limit: this.users.limit,
      };
      api.get_users(param).then((res) => {
        this.users = res.data;
        this.users.data.forEach((item) => {
          item.payment = {
            currency: null,
            money: 0,
            currency_id: 0,
            source: item.id,
            comment: "",
          };
        });
      });
    },
    payUser(item) {
      item.payment.currency_id = item.payment.currency?.id || 0;
      api.pay_to_user(item.payment).then(() => {
        item.payment = {
          currency: null,
          money: 0,
          currency_id: 0,
          source: item.id,
          comment: "",
        };
        this.$util.toast();
      });
    },
    format(number) {
      return String(
        "(" +
          String(number).substring(0, 2) +
          ") " +
          String(number).substring(2, 5) +
          " " +
          String(number).substring(5, 7) +
          " " +
          String(number).substring(7, 9)
      );
    },
    role(role) {
      if (role == "admin") return "Admin";
      else if (role == "branch_admin") return "Filial admin";
      else if (role == "seller") return "Sotuvchi";
    },
  },
};
</script>

<template>
  <div class="row gap-3">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">{{ title.toUpperCase() }}LAR</h2>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-7 text-end">
              <div class="btn-group h-100" @click="$refs.addUser.open()">
                <div class="d-flex align-items-center">
                  + {{ title }} qo'shish
                </div>
                <button class="btn btn-sm btn-success mx-1">
                  <img
                    src="../../assets/icons/Add_ring-white.svg"
                    alt="Add_ring-white"
                  />
                </button>
              </div>
            </div>
            <div class="col-md-5">
              <div class="row">
                <div class="col-8">
                  <input
                    type="search"
                    class="form-control"
                    placeholder="Qidiruv:"
                    v-model="search"
                  />
                </div>
                <div class="col-4">
                  <button class="btn btn-sm btn-primary" @click="get()">
                    <img src="../../assets/icons/Search_alt.svg" alt="" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="row table-responsive" style="max-height: 80vh">
        <div class="col-md-6 mb-3" v-for="item in users.data" :key="item">
          <div class="card">
            <div class="card-body">
              <strong>{{ item.name }}</strong>
              <ul class="list-group">
                <li class="list-group-item">
                  <span>Tel:</span>
                  <a :href="'tel:+998' + item.phone">{{
                    "+998 " + format(item.phone)
                  }}</a>
                </li>
                <li class="list-group-item">
                  <span>Lavozim:</span>
                  <span>{{ role(item.role) }}</span>
                </li>
                <li class="list-group-item">
                  <span>Daromad:</span>
                  <span>{{ item.balance }}</span>
                </li>
              </ul>
              <ul class="list-group" v-if="current_user.role !== 'crud_admin'">
                <li class="list-group-item" :toggle-collapse="'pay-' + item.id">
                  <span>Pul berish</span>
                </li>
                <Collapse :id="'pay-' + item.id">
                  <form @submit.prevent="payUser(item)">
                    <div
                      class="input-group"
                      :currency="$util.currency(item.payment.money)"
                    >
                      <input
                        class="form-control"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Summa:"
                        v-model="item.payment.money"
                        required
                      />
                      <div class="input-group-append">
                        <DataDropdown
                          type="currency"
                          property="currency"
                          v-model="item.payment.currency"
                        ></DataDropdown>
                      </div>
                    </div>
                    <div class="input-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Izoh:"
                        required
                        v-model="item.payment.comment"
                      />
                    </div>
                    <button
                      type="button"
                      class="btn btn-sm btn-danger mt-2 mx-1 float-end"
                      @click="
                        item.payment = {
                          currency: null,
                          money: 0,
                          currency_id: 0,
                          source: item.id,
                          comment: '',
                        }
                      "
                    >
                      <img
                        src="../../assets/icons/Cancel-white.svg"
                        alt="Cancel"
                      />
                    </button>
                    <button
                      class="btn btn-sm btn-success mt-2 mx-1 float-end"
                      :disabled="!item.payment.currency"
                    >
                      <img
                        src="../../assets/icons/Done_round-white.svg"
                        alt="Done_round"
                      />
                    </button>
                  </form>
                </Collapse>
              </ul>
              <div class="row mt-3">
                <div
                  class="col"
                  v-if="!['crud_admin', 'admin'].includes(current_user.role)"
                >
                  <RouterLink
                    class="btn btn-sm w-100 btn-primary"
                    :to="{
                      path: '/user',
                      query: { user_id: item.id, content: 'history' },
                    }"
                  >
                    <img src="../../assets/icons/Info.svg" alt="Info" />
                  </RouterLink>
                </div>
                <div class="col" v-if="current_user.role !== 'crud_admin'">
                  <RouterLink
                    class="btn btn-sm w-100 btn-warning"
                    :to="{
                      path: '/user',
                      query: { user_id: item.id, content: 'edit' },
                    }"
                  >
                    <img src="../../assets/icons/Edit.svg" alt="Info" />
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <Pagination v-model="users" @get="get" />
        </div>
      </div>
    </div>
  </div>

  <AddUser @end="get()" ref="addUser" />
</template>

<style scoped></style>

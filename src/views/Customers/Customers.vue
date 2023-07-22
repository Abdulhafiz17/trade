<script>
import api from "../../server/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Customers",
  components: { Pagination },
  data() {
    return {
      search: "",
      customers: {
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
      return this.$route.query.branch_id || this.current_user?.branch_id;
    },
  },
  created() {
    this.get();
  },
  methods: {
    get() {
      const param = {
        search: this.search,
        branch_id: this.branch_id,
        page: this.customers.current_page,
        limit: this.customers.limit,
      };
      api.get_customers(param).then((res) => {
        this.customers = res.data;
        this.customers.data.forEach((item) => {
          item.loans = {
            current_page: 0,
            pages: 1,
            limit: 25,
            data: [],
          };
        });
      });
    },
    getLoans(item) {
      const param = {
        status: false,
        branch_id: this.branch_id,
        customer_id: item.id,
        order_id: 0,
        page: item.loans.current_page,
        limit: item.loans.limit,
      };
      api.get_loans(param).then((res) => {
        item.loans = res.data;
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
          <h2 class="title">MIJOZLAR</h2>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-10">
              <input
                type="search"
                class="form-control"
                placeholder="Qidiruv:"
                v-model="search"
                @keyup="get()"
              />
            </div>
            <div class="col-2">
              <button class="btn btn-sm btn-primary">
                <img src="../../assets/icons/Search_alt.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="row table-responsive" style="max-height: 80vh">
        <div class="col-md-6 mb-3" v-for="item in customers.data" :key="item">
          <div class="card">
            <div class="card-body">
              <strong>{{ item.name }}</strong>
              <ul class="list-group">
                <li class="list-group-item">
                  <span>Tel:</span>
                  <a :href="'tel:+998' + item.phone">{{
                    "+998 " + $util.tel(item.phone)
                  }}</a>
                </li>
                <li class="list-group-item">
                  <span>Toifa:</span>
                  <span>{{ item.type }}</span>
                </li>
              </ul>
              <ul class="list-group">
                <li
                  class="list-group-item"
                  :toggle-collapse="'loan-' + item.id"
                  @click="item.open ? false : getLoans(item)"
                >
                  <span>Nasiyalar</span>
                </li>
                <Collapse
                  class="p-1"
                  :id="'loan-' + item.id"
                  v-model:open="item.open"
                >
                  <div class="table-responsive" style="max-height: 30vh">
                    <table class="table table-sm table-hover">
                      <thead>
                        <tr>
                          <th>Nasiya summa</th>
                          <th>Qoldiq summa</th>
                          <th>Qaytarish sana</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item1 in item.loans.data" :key="item1">
                          <td>
                            {{ $util.currency(item1.Loans.money) + " so'm" }}
                          </td>
                          <td>
                            {{ $util.currency(item1.Loans.residual) + " so'm" }}
                          </td>
                          <td>{{ item1.Loans.return_date }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Collapse>
              </ul>
              <div class="row mt-3">
                <div class="col">
                  <RouterLink
                    class="btn btn-sm w-100 btn-primary"
                    :to="{
                      path: '/customer',
                      query: { customer_id: item.id, content: 'history' },
                    }"
                  >
                    <img src="../../assets/icons/Info.svg" alt="Info" />
                  </RouterLink>
                </div>
                <div class="col">
                  <RouterLink
                    class="btn btn-sm w-100 btn-warning"
                    :to="{
                      path: '/customer',
                      query: { customer_id: item.id, content: 'edit' },
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
          <Pagination v-model="customers" @get="get" />
        </div>
      </div>
    </div>
  </div>
</template>

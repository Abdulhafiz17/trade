<script>
import api from "../../server/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Loans",
  components: { Pagination },
  data() {
    return {
      status: false,
      customer: null,
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
  },
  created() {
    this.getCustomers();
  },
  methods: {
    changeTab(tab) {
      if (tab == 0) this.status = false;
      else this.status = true;
      this.getCustomers();
    },
    getCustomers() {
      const param = {
        status: this.status,
        customer_id: this.customer?.id || 0,
        page: this.customers.current_page,
        limit: this.customers.limit,
      };
      api.get_loans_customer(param).then((res) => {
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
        status: this.status,
        customer_id: item.Customers.id,
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
          <h2 class="title">NASIYALAR</h2>
        </div>
        <div class="col-md-6">
          <DataDropdown
            type="customer"
            property="name"
            all
            v-model="customer"
            @change="getCustomers"
          ></DataDropdown>
          <!-- <div class="row">
            <div class="col-md-10">
              <div class="inpur-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Qidiruv:"
                />
              </div>
            </div>
            <div class="col-md-2">
              <button class="btn btn-sm btn-primary">
                <img src="../../assets/icons/Search_alt.svg" alt="" />
              </button>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <div class="col-12">
      <Tab :tabs="[`Faol`, `Yakunlangan`]" @change="changeTab">
        <template #1>
          <div class="table-responsive row" style="max-height: 70vh">
            <div
              class="col-md-6 mb-2"
              v-for="item in customers.data"
              :key="item"
            >
              <div class="card">
                <div
                  class="card-body"
                  :toggle-collapse="'loans' + item.Customers.id"
                  @click="!item.open && getLoans(item)"
                >
                  <h5>{{ item.Customers.name }}</h5>
                  <strong>
                    {{ $util.currency(item.sum_loan_price) }} so'm
                  </strong>
                </div>
                <Collapse
                  :id="'loans' + item.Customers.id"
                  v-model:open="item.open"
                >
                  <div class="card-body">
                    <div class="table-responsive" style="max-height: 40vh">
                      <table class="table table-sm table-hover">
                        <thead>
                          <tr>
                            <th>Nasiya summa</th>
                            <th>Qoldiq summa</th>
                            <th>Qaytarish sana</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item1 in item.loans.data" :key="item1">
                            <td>
                              {{ $util.currency(item1.Loans.money) }} so'm
                            </td>
                            <td>
                              {{ $util.currency(item1.Loans.residual) }} so'm
                            </td>
                            <td>{{ item1.Loans.return_date }}</td>
                            <td>
                              <RouterLink
                                class="btn btn-sm btn-info"
                                :to="{
                                  path: '/loan',
                                  query: { loan_id: item1.Loans.id },
                                }"
                              >
                                <img
                                  src="../../assets/icons/Info.svg"
                                  alt="Info"
                                />
                              </RouterLink>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colspan="4">
                              <Pagination
                                v-model="item.loans"
                                @get="getLoans(item)"
                              />
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </Collapse>
              </div>
            </div>
            <div class="col-12">
              <Pagination v-model="customers" @get="getCustomers" />
            </div>
          </div>
        </template>
        <template #2>
          <div class="table-responsive row" style="max-height: 70vh">
            <div
              class="col-md-6 mb-2"
              v-for="item in customers.data"
              :key="item"
            >
              <div class="card">
                <div
                  class="card-body"
                  :toggle-collapse="'loans' + item.Customers.id"
                  @click="!item.open && getLoans(item)"
                >
                  <h5>{{ item.Customers.name }}</h5>
                </div>
                <Collapse
                  :id="'loans' + item.Customers.id"
                  v-model:open="item.open"
                >
                  <div class="card-body">
                    <div class="table-responsive" style="max-height: 40vh">
                      <table class="table table-sm table-hover">
                        <thead>
                          <tr>
                            <th>Nasiya summa</th>
                            <th>Qoldiq summa</th>
                            <th>Qaytarish sana</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item1 in item.loans.data" :key="item1">
                            <td>
                              {{ $util.currency(item1.Loans.money) }} so'm
                            </td>
                            <td>
                              {{ $util.currency(item1.Loans.residual) }} so'm
                            </td>
                            <td>{{ item1.Loans.return_date }}</td>
                            <td>
                              <RouterLink
                                class="btn btn-sm btn-info"
                                :to="{
                                  path: '/loan',
                                  query: { loan_id: item1.Loans.id },
                                }"
                              >
                                <img
                                  src="../../assets/icons/Info.svg"
                                  alt="Info"
                                />
                              </RouterLink>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colspan="4">
                              <Pagination
                                v-model="item.loans"
                                @get="getLoans(item)"
                              />
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </Collapse>
              </div>
            </div>
            <div class="col-12">
              <Pagination v-model="customers" @get="getCustomers" />
            </div>
          </div>
        </template>
      </Tab>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  overflow: hidden;
}
</style>

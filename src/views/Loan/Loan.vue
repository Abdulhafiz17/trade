<script>
import api from "../../server/api";
import PaymentModal from "../../components/Modal/PaymentModal.vue";
import OrderModal from "../../components/Modal/OrderModal.vue";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Loan",
  components: { Pagination, PaymentModal, OrderModal },
  data() {
    return {
      loan_id: this.$route.query.loan_id,
      loan: null,
      history: {
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
    this.getLoan();
    this.getHistory();
  },
  methods: {
    getLoan() {
      const param = {
        loan_id: this.loan_id,
        order_id: 0,
      };
      api.get_loan(param).then((res) => {
        this.loan = res.data;
      });
    },
    getHistory() {
      const param = {
        source: this.loan_id,
        status: "loan",
        page: this.history.current_page,
        limit: this.history.limit,
      };
      api.get_incomes(param).then((res) => {
        this.history = res.data;
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
          <h2 class="title">NASIYA</h2>
        </div>
        <div class="col-md-6 text-end">
          <button
            class="btn btn-sm btn-success"
            @click="$refs.loanPaymentModal.openModal()"
          >
            To'lov
          </button>
          <button
            class="btn btn-sm btn-primary mx-2"
            @click="$refs.orderModal.start(loan.Loans.order_id)"
          >
            Nasiya buyurtmasi
          </button>
          <button class="btn btn-sm btn-primary" @click="$router.go(-1)">
            ⇽
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="row">
        <div class="col-md">
          <p>Nasiya summa</p>
          <strong>{{ $util.currency(loan?.Loans?.money) }}</strong> so'm
        </div>
        <div class="col-md" v-if="loan?.Loans?.money">
          <p>Qoldiq summa</p>
          <strong>{{ $util.currency(loan?.Loans?.residual) }}</strong> so'm
        </div>
        <div class="col-md">
          <p>Qaytarish sana</p>
          {{ loan?.Loans?.return_date }}
        </div>
        <div class="col-md">
          <p>Mijoz</p>
          {{ loan?.Customers?.name }}
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="table-responsive" style="max-height: 72vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Summa</th>
              <th>Hodim</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in history.data" :key="item">
              <td>
                <strong>
                  {{ $util.currency(item.Incomes.money) }}
                </strong>
                so'm
                {{ item.Incomes.type }}
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.Incomes.time.replace("T", " ") }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4">
                <Pagination v-model="history" @get="getHistory" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>

  <PaymentModal
    :source="this.loan_id"
    type="loan"
    @end="this.getHistory"
    ref="loanPaymentModal"
  />
  <OrderModal ref="orderModal" />
</template>

<style scoped lang="scss">
button {
  height: auto;
}
</style>

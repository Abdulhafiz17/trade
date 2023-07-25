<script>
import api from "../../server/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Expenses",
  components: { Pagination },
  data() {
    return {
      party_id: this.$route.query.party_id,
      status: this.$route.query.status,
      currency: null,
      expense: {
        money: null,
        currency_id: null,
        source: null,
        comment: "",
      },
      expenses: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.get();
  },
  methods: {
    get() {
      const param = {
        party_id: this.party_id,
        page: this.expenses.current_page,
        limit: this.expenses.limit,
      };
      api.get_party_expenses(param).then((res) => {
        this.expenses = res.data;
      });
    },
    post() {
      this.expense.currency_id = this.currency.id;
      this.expense.source = this.party_id;
      api.pay_for_party_expense(this.expense).then(() => {
        this.currency = null;
        this.expense = {
          money: null,
          currency_id: null,
          source: null,
          comment: "",
        };
        this.$util.toast().then(() => {
          this.get();
        });
      });
    },
    remove() {},
  },
};
</script>

<template>
  <div class="row gap-2">
    <div class="col-12" v-if="status == 'false'">
      <form class="row" @submit.prevent="post()">
        <div class="col-md-5 mb-1">
          <div class="input-group" :currency="$util.currency(expense.money)">
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              placeholder="summa:"
              required
              v-model="expense.money"
            />
            <div class="input-group-append">
              <DataDropdown
                v-model="currency"
                type="currency"
                property="currency"
              ></DataDropdown>
            </div>
          </div>
        </div>
        <div class="col-md-5 mb-1">
          <input
            type="text"
            class="form-control"
            placeholder="izoh:"
            required
            v-model="expense.comment"
          />
        </div>
        <div class="col-md-2 mb-1">
          <button class="btn btn-success w-100" :disabled="!currency">
            <img src="../../assets/icons/Add_square.svg" alt="Add_square" />
          </button>
        </div>
      </form>
    </div>
    <div class="col-12">
      <div class="row table-responsive" style="max-height: 65vh">
        <div
          class="col-md-3 col-6 mb-1"
          v-for="item in expenses.data"
          :key="item"
        >
          <div class="card">
            <div class="card-body">
              <div class="row gap-2">
                <div class="col-12">
                  <strong>{{ $util.currency(item.Expenses.money) }}</strong>
                  {{ item.currency }}
                  <p>{{ item.Expenses.comment }}</p>
                </div>
                <div class="col-12" v-if="false">
                  <button
                    class="btn btn-sm btn-danger float-end"
                    @click="remove(item.Expenses.id)"
                  >
                    <img src="../../assets/icons/del_alt.svg" alt="del_alt" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <Pagination v-model="expenses" @get="get()" />
        </div>
      </div>
    </div>
  </div>
</template>

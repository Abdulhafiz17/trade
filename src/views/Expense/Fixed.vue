<script>
import api from "../../server/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Fixed",
  components: { Pagination },
  props: {
    fixed_expenses: Array,
  },
  emits: {
    addExpense: null,
  },
  data() {
    return {
      fixed_expense: {
        name: "",
      },
      filter: {
        fixed_expense: null,
        from_time: "",
        to_time: "",
      },
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
    this.getHistory();
  },
  methods: {
    getHistory() {
      const param = {
        branch_id: this.current_user.branch_id,
        from_time: this.filter.from_time,
        to_time: this.filter.to_time,
        fixed_expense_id: this.filter.fixed_expense?.id || 0,
        page: this.history.current_page,
        limit: this.history.limit,
      };
      api.fixed_expenses_get(param).then((res) => {
        this.history = res.data;
      });
    },
    addExpense() {
      api.create_fixed_expense(this.fixed_expense).then(() => {
        this.$util.toast().then(() => {
          this.fixed_expense.name = "";
          this.$emit("addExpense");
        });
      });
    },
    putExpense(item) {
      api.update_fixed_expense(item).then(() => {
        this.$util.toast();
      });
    },
  },
};
</script>

<template>
  <div class="row gap-2">
    <div class="col-12">
      <div class="row">
        <div class="col-md-2 mb-1">
          <button
            class="p-0 btn-group btn-group-sm bg-white"
            @click="$refs.fixedExpensesModal.openModal()"
          >
            <span>Doimiy chiqimlar</span>
            <span class="btn bg-success">
              <img src="../../assets/icons/Pipe.svg" alt="Pipe" />
            </span>
          </button>
        </div>
        <div class="col-md-3 mb-1">
          <DataDropdown
            :data="fixed_expenses"
            type="expense"
            property="name"
            all
            v-model="filter.fixed_expense"
          ></DataDropdown>
        </div>
        <div class="col-md-3 mb-1">
          <input type="date" class="form-control" v-model="filter.from_time" />
        </div>
        <div class="col-md-3 mb-1">
          <input type="date" class="form-control" v-model="filter.to_time" />
        </div>
        <div class="col-md-1 mb-2">
          <button class="btn btn-primary w-100" @click="getHistory()">
            <img src="../../assets/icons/Search_alt.svg" alt="Search_alt" />
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="table-responsive" style="height: 62vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Chiqim</th>
              <th>Summa</th>
              <th>Izoh</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in history.data" :key="item">
              <td>{{ item.name }}</td>
              <td>
                <strong>{{ $util.currency(item.Expenses.money) }}</strong>
                {{ item.Currencies.currency }}
              </td>
              <td>{{ item.Expenses.comment }}</td>
              <td>{{ item.Expenses.time.replace("T", " ") }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="4">
                <Pagination v-model="history" @get="getHistory" />
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>

  <Modal ref="fixedExpensesModal">
    <template #header>
      <h5>Doimiy chiqimlar</h5>
    </template>
    <template #body>
      <div class="row gap-2 table-responsive" style="max-height: 70vh">
        <div class="col-12">Yangi chiqim turi</div>
        <div class="col-12">
          <form class="input-group" @submit.prevent="addExpense()">
            <input
              type="text"
              class="form-control"
              placeholder="Chiqim nomi:"
              required
              v-model="fixed_expense.name"
            />
            <div class="input-group-append">
              <button class="btn btn-success">
                <img src="../../assets/icons/Add_square.svg" alt="Add_square" />
              </button>
            </div>
          </form>
        </div>
        <div class="col-12">Mavjud chiqim turlari</div>
        <div class="col-12" v-for="item in fixed_expenses" :key="item">
          <form class="input-group" @submit.prevent="putExpense(item)">
            <input
              type="text"
              class="form-control"
              placeholder="Chiqim nomi:"
              required
              v-model="item.name"
            />
            <div class="input-group-append">
              <button class="btn btn-warning">
                <img src="../../assets/icons/Edit.svg" alt="Edit" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
button {
  font-size: small;
  font-weight: normal;
}

.bg-success {
  height: 100%;
  display: flex;
}
</style>

<script>
import api from "../../server/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Variable",
  components: { Pagination },
  data() {
    return {
      filter: {
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
        page: this.history.current_page,
        limit: this.history.limit,
      };
      api.get_variable_expenses(param).then((res) => {
        this.history = res.data;
      });
    },
  },
};
</script>

<template>
  <div class="row gap-2">
    <div class="col-12">
      <div class="row">
        <div class="col-md-5">
          <input type="date" class="form-control" v-model="filter.from_time" />
        </div>
        <div class="col-md-5">
          <input type="date" class="form-control" v-model="filter.to_time" />
        </div>
        <div class="col-md-2">
          <button class="btn btn-primary w-100" @click="getHistory()">
            <img src="../../assets/icons/Search_alt.svg" alt="Search_alt" />
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="table-responsive" style="height: 62vh">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Summa</th>
              <th>Izoh</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in history.data" :key="item">
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
</template>

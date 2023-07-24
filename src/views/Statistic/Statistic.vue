<script>
import api from "../../server/api";
import OrderModal from "../../components/Modal/OrderModal.vue";
export default {
  name: "Statistic",
  components: { OrderModal },
  data() {
    return {
      filter: {
        from_time: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .substring(0, 10),
        to_time: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() + 1
        )
          .toISOString()
          .substring(0, 10),
        branch_id: this.$route.query.branch_id,
      },
      statistics: {
        data: [],
        data_sum: [],
      },
      day: null,
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.getStatistics();
  },
  methods: {
    getStatistics() {
      const param = {
        from_time: this.filter.from_time,
        to_time: this.filter.to_time,
        branch_id_admin: this.filter.branch_id || this.current_user?.branch_id,
      };
      api.get_trade_statistics(param).then((res) => {
        this.statistics = res.data;
      });
    },
    countSum(array) {
      return array.reduce((total, item) => total + item.sum_price, 0);
    },
    benefit(data) {
      return (
        data.trade_total_price +
        data.trade_from_comp_total_price -
        (data.trade_total_tan_narx + data.trade_from_comp_total_tan_narx) -
        data.order_discount -
        (data.trade_total_discount + data.trade_from_comp_total_discount) -
        data.expense_sum -
        data.returned_price
      );
    },
  },
};
</script>

<template>
  <div class="row gap-3">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">HISOBOTLAR</h2>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-5 mb-1">
              <div class="btn-group float-end">
                <button
                  class="btn btn-sm"
                  @click="$refs.sumStatisticsModal.openModal()"
                >
                  Umumiy hisobot
                </button>
                <button class="btn btn-sm btn-success">
                  <img src="../../assets/icons/Pipe.svg" alt="Pipe" />
                </button>
              </div>
            </div>
            <form class="col-md-7" @submit.prevent="getStatistics()">
              <div class="row">
                <div class="col-5">
                  <input
                    type="date"
                    class="form-control"
                    v-model="filter.from_time"
                  />
                </div>
                <div class="col-5">
                  <input
                    type="date"
                    class="form-control"
                    v-model="filter.to_time"
                  />
                </div>
                <div class="col-2">
                  <button class="btn btn-sm btn-primary">
                    <img
                      src="../../assets/icons/search_alt.svg"
                      alt="search_alt"
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="row table-responsive" style="max-height: 80vh">
        <div
          class="col-md-6 mb-3"
          v-for="(item, i) in statistics.data"
          :key="item"
        >
          <div class="card">
            <div class="card-body">
              <strong>{{ item.day }}</strong>
              <ul class="list-group">
                <li class="list-group-item">
                  <span>Savdo:</span>
                  <strong>
                    {{
                      $util.currency(
                        item.trade_total_price +
                          item.trade_from_comp_total_price
                      )
                    }}
                    so'm
                  </strong>
                </li>
                <li class="list-group-item">
                  <span>Tan narx:</span>
                  <strong>
                    {{
                      $util.currency(
                        item.trade_total_tan_narx +
                          item.trade_from_comp_total_tan_narx
                      )
                    }}
                    so'm
                  </strong>
                </li>
                <li class="list-group-item">
                  <span>Buyurtmadan chegirma:</span>
                  <strong>
                    {{ $util.currency(item.order_discount) }}
                    so'm
                  </strong>
                </li>
                <li class="list-group-item">
                  <span>Mahsulotdan chegirma:</span>
                  <strong>
                    {{
                      $util.currency(
                        item.trade_total_discount +
                          item.trade_from_comp_total_discount
                      )
                    }}
                    so'm
                  </strong>
                </li>
              </ul>
              <ul class="list-group">
                <li
                  class="list-group-item"
                  :toggle-collapse="'trade-income-collapse' + i"
                >
                  <span>Savdodan kirim:</span>
                  <strong>
                    {{ $util.currency(countSum(item.incomes_trade)) }}
                    so'm
                  </strong>
                </li>
                <Collapse :id="'trade-income-collapse' + i">
                  <li class="list-group-item d-block">
                    <ul class="list-group">
                      <li
                        class="list-group-item"
                        v-for="item1 in item.incomes_trade"
                        :key="item1"
                      >
                        <strong>{{
                          $util.currency(item1.sum_price) +
                          " so'm " +
                          item1.type
                        }}</strong>
                      </li>
                    </ul>
                  </li>
                </Collapse>
              </ul>
              <ul class="list-group">
                <li
                  class="list-group-item"
                  :toggle-collapse="'loan-income-collapse' + i"
                >
                  <span>Nasiyadan kirim:</span>
                  <strong>
                    {{ $util.currency(countSum(item.incomes_loan)) }}
                    so'm
                  </strong>
                </li>
                <Collapse :id="'loan-income-collapse' + i">
                  <li class="list-group-item d-block">
                    <ul class="list-group">
                      <li
                        class="list-group-item"
                        v-for="item1 in item.incomes_loan"
                        :key="item1"
                      >
                        <strong>{{
                          $util.currency(item1.sum_price) +
                          " so'm " +
                          item1.type
                        }}</strong>
                      </li>
                    </ul>
                  </li>
                </Collapse>
              </ul>
              <ul class="list-group">
                <li class="list-group-item">
                  <span>Chiqim:</span>
                  <strong>
                    {{ $util.currency(item.expense_sum) }}
                    so'm
                  </strong>
                </li>
                <li class="list-group-item">
                  <span>Qaytarish chiqimi:</span>
                  <strong>
                    {{ $util.currency(item.expenses_returned) }}
                    so'm
                  </strong>
                </li>
              </ul>
              <div class="row mt-2">
                <div class="col">
                  <button
                    class="btn btn-info float-end"
                    @click="
                      day = item;
                      $refs.dayModal.openModal();
                    "
                  >
                    <img src="../../assets/icons/Info.svg" alt="Info" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal size="lg" ref="dayModal">
    <template #header>
      <strong>
        {{ day.day }}
      </strong>
    </template>
    <template #body>
      <Tab :tabs="[`Buyurtmalar`]">
        <template #1>
          <div class="row gap-1 table-responsive" style="max-height: 60vh">
            <div class="col-12 item" v-for="item in day?.orders" :key="item">
              <div class="flex cursor" @click="$refs.orderModal.start(item.id)">
                <span>{{ "Buyurtma raqami: " + item.ordinal_number }}</span>
                <span>{{ item.time.replace("T", " ").substring(0, 16) }}</span>
              </div>
            </div>
          </div>
        </template>
      </Tab>
    </template>
  </Modal>

  <OrderModal returnable ref="orderModal" />

  <Modal ref="sumStatisticsModal">
    <template #header>
      <h5>UMUMIY HISOBOT</h5>
    </template>
    <template #body>
      <div class="card border-0">
        <div
          class="card-body"
          v-for="(item, i) in statistics.data_sum"
          :key="item"
        >
          <ul class="list-group">
            <li class="list-group-item">
              <span>Savdo:</span>
              <strong>
                {{
                  $util.currency(
                    item.trade_total_price + item.trade_from_comp_total_price
                  )
                }}
                so'm
              </strong>
            </li>
            <li class="list-group-item">
              <span>Tan narx:</span>
              <strong>
                {{
                  $util.currency(
                    item.trade_total_tan_narx +
                      item.trade_from_comp_total_tan_narx
                  )
                }}
                so'm
              </strong>
            </li>
            <li class="list-group-item">
              <span>Buyurtmadan chegirma:</span>
              <strong>
                {{ $util.currency(item.order_discount) }}
                so'm
              </strong>
            </li>
            <li class="list-group-item">
              <span>Mahsulotdan chegirma:</span>
              <strong>
                {{
                  $util.currency(
                    item.trade_total_discount +
                      item.trade_from_comp_total_discount
                  )
                }}
                so'm
              </strong>
            </li>
          </ul>
          <ul class="list-group">
            <li
              class="list-group-item"
              :toggle-collapse="'trade-income-collapse' + i"
            >
              <span>Savdodan kirim:</span>
              <strong>
                {{ $util.currency(countSum(item.incomes_trade)) }}
                so'm
              </strong>
            </li>
            <Collapse :id="'trade-income-collapse' + i">
              <li class="list-group-item d-block">
                <ul class="list-group">
                  <li
                    class="list-group-item"
                    v-for="item1 in item.incomes_trade"
                    :key="item1"
                  >
                    <strong>{{
                      $util.currency(item1.sum_price) + " so'm " + item1.type
                    }}</strong>
                  </li>
                </ul>
              </li>
            </Collapse>
          </ul>
          <ul class="list-group">
            <li
              class="list-group-item"
              :toggle-collapse="'loan-income-collapse' + i"
            >
              <span>Nasiyadan kirim:</span>
              <strong>
                {{ $util.currency(countSum(item.incomes_loan)) }}
                so'm
              </strong>
            </li>
            <Collapse :id="'loan-income-collapse' + i">
              <li class="list-group-item d-block">
                <ul class="list-group">
                  <li
                    class="list-group-item"
                    v-for="item1 in item.incomes_loan"
                    :key="item1"
                  >
                    <strong>{{
                      $util.currency(item1.sum_price) + " so'm " + item1.type
                    }}</strong>
                  </li>
                </ul>
              </li>
            </Collapse>
          </ul>
          <ul class="list-group">
            <li class="list-group-item">
              <span>Chiqim:</span>
              <strong>
                {{ $util.currency(item.expense_sum) }}
                so'm
              </strong>
            </li>
            <li class="list-group-item">
              <span>Qaytarish chiqimi:</span>
              <strong>
                {{ $util.currency(item.expenses_returned) }}
                so'm
              </strong>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
h5 {
  font-weight: 900;
}
.flex {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: thin solid whitesmoke;
  border-radius: 10px;
}
</style>

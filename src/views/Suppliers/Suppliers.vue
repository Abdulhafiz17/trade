<script>
import api from "../../server/api";
import AddSupplier from "./AddSupplier.vue";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Suppliers",
  components: { AddSupplier, Pagination },
  data() {
    return {
      suppliers: { current_page: 0, pages: 1, limit: 25, data: [] },
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.get();
  },
  methods: {
    get() {
      const param = {
        page: this.suppliers.current_page,
        limit: this.suppliers.limit,
      };
      api.get_markets(param).then((res) => {
        this.suppliers = res.data;
        this.suppliers.data.forEach((item) => {
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
    pay(item) {
      item.payment.currency_id = item.payment.currency?.id || 0;
      api.pay_for_market_expense(item.payment).then(() => {
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
  },
};
</script>

<template>
  <div class="row gap-3">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">TA'MINOTCHILAR</h2>
        </div>
        <div class="col-md-6">
          <button
            class="btn btn-success float-end"
            @click="$refs.addSupplier.open()"
          >
            <img src="../../assets/icons/Add_square.svg" alt="Add_square" />
            Ta'minotchi qo'shish
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="row table-responsive" style="max-height: 80vh">
        <div class="col-md-6 mb-3" v-for="item in suppliers.data" :key="item">
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
                  <span>Manzil:</span>
                  <span>{{ item.address }}</span>
                </li>
                <li class="list-group-item">
                  <span>Balans:</span>
                  <span>
                    <span
                      v-for="(item1, i) in item.balances"
                      :key="item1"
                      :class="{
                        'text-success': item1.balance > 0,
                        'text-danger': item1.balance < 0,
                      }"
                    >
                      <strong>{{ $util.currency(item1.balance) }}</strong>
                      {{ item1.currency.currency }}
                      {{ i < item.balances.length - 1 ? " " : "" }}
                    </span>
                  </span>
                </li>
              </ul>
              <ul class="list-group" v-if="current_user.role !== 'crud_admin'">
                <li class="list-group-item" :toggle-collapse="'pay-' + item.id">
                  <span>Pul berish</span>
                </li>
                <Collapse :id="'pay-' + item.id">
                  <form @submit.prevent="pay(item)">
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
                      path: '/supplier',
                      query: { supplier_id: item.id, content: 'history' },
                    }"
                  >
                    <img src="../../assets/icons/Info.svg" alt="Info" />
                  </RouterLink>
                </div>
                <div class="col" v-if="current_user.role !== 'crud_admin'">
                  <RouterLink
                    class="btn btn-sm w-100 btn-warning"
                    :to="{
                      path: '/supplier',
                      query: { supplier_id: item.id, content: 'edit' },
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
          <Pagination v-model="suppliers" @get="get" />
        </div>
      </div>
    </div>
  </div>

  <AddSupplier @end="get()" ref="addSupplier" />
</template>

<script>
import api from "../../server/api";
import Orders from "./Orders.vue";
import Trades from "./Trades.vue";
export default {
  name: "Order",
  components: { Orders, Trades },
  data() {
    return {
      order: null,
      orders: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      balance: null,
      customer_type: "",
      order_confirm: {
        order_id: 0,
        customer_name: "",
        customer_phone: 0,
        customer_type: "",
        discount: 0,
        money: [
          {
            paid_money: 0,
            type: "",
          },
        ],
        loan_repayment_date: "",
        seller_id: 0,
        muddat: 0,
        percent: 0,
        date: "",
      },
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.getOrders();
  },
  methods: {
    getOrders() {
      const param = {
        branch_id: this.current_user?.branch_id,
        order_id: 0,
        seller_id: 0,
        user_id: 0,
        customer_id: 0,
        status: "false",
        from_time: "",
        to_time: "",
        page: 0,
        limit: 25,
      };
      api.get_orders(param).then((res) => {
        this.orders = res.data;
        this.order = res.data.data[0];
        this.$nextTick(() => {
          this.$refs.trades.getTrades();
        });
      });
    },
    changeOrder() {
      this.$refs.trades.getTrades();
    },
  },
};
</script>

<template>
  <div class="row gap-3">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">KASSA</h2>
        </div>
        <div class="col-md-6">
          <Orders
            ref="orders"
            v-model:order="order"
            :orders="orders"
            @update:order="
              $nextTick(() => {
                changeOrder();
              })
            "
          />
        </div>
      </div>
    </div>
    <div class="col-12">
      <Trades ref="trades" :order="order" />
    </div>
    <div class="col-12">
      <div class="order">
        <h4>
          <span class="number" v-if="order">
            {{ order.Orders.ordinal_number }}
          </span>
          Buyurtma
        </h4>
        <div>
          <strong class="balance">
            {{ $util.currency(balance) + " so'm" }}
          </strong>
          <button
            class="btn-group p-0 btn btn-outline-light"
            @click="$refs.confirmModal.openModal()"
          >
            <span class="btn-sm text-success">Tasdiqlash</span>
            <span class="btn-sm bg-success">
              <img src="../../assets/icons/Done_all_round.svg" alt="" />
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <Modal ref="confirmModal">
    <template #header>
      <strong>
        {{ $util.currency(balance) + " so'm" }}
      </strong>
    </template>
    <template #body>
      <div class="row gap-2">
        <div class="col-12">
          <div class="row">
            <div class="col">
              <button
                class="btn btn-light w-100"
                :class="{ 'text-light bg-primary': customer_type == '' }"
                @click="customer_type = ''"
              >
                Umumiy
              </button>
            </div>
            <div class="col">
              <button
                class="btn btn-light w-100"
                :class="{
                  'text-light bg-primary': customer_type == 'customer',
                }"
                @click="customer_type = 'customer'"
              >
                Doimiy
              </button>
            </div>
            <div class="col">
              <button
                class="btn btn-light w-100"
                :class="{ 'text-light bg-primary': customer_type == 'new' }"
                @click="customer_type = 'new'"
              >
                Yangi
              </button>
            </div>
          </div>
        </div>
        <label class="col-12">
          To'lov summa
          <div class="row gap-1">
            <div
              class="col-12"
              v-for="(item, i) in order_confirm.money"
              :key="item"
            >
              <div
                class="input-group"
                :currency="$util.currency(item.paid_money)"
              >
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  step="any"
                  required
                  v-model="item.paid_money"
                />
                <div class="input-group-text">so'm</div>
                <div class="input-group-append">
                  <select class="form-select" required v-model="item.type">
                    <option hidden value="">to'lov turi</option>
                    <option
                      v-for="item1 in $util.payment_types"
                      :key="item1"
                      :value="item1"
                    >
                      {{ item1 }}
                    </option>
                  </select>
                </div>
                <div class="input-group-append">
                  <button
                    class="btn-success"
                    @click="
                      order_confirm.money.push({
                        paid_money: 0,
                        type: '',
                      })
                    "
                    v-if="i == 0 && order_confirm.money.length < 3"
                  >
                    <img
                      src="../../assets/icons/Add_square.svg"
                      alt="Add_square"
                    />
                  </button>
                  <button
                    class="btn-danger"
                    @click="order_confirm.money.splice(i, 1)"
                    v-else
                  >
                    <img src="../../assets/icons/del_alt.svg" alt="del_alt" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </label>
        <label class="col-12">
          Chegirma summa
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              required
              v-model="order_confirm.discount"
            />
            <div class="input-group-text">so'm</div>
          </div>
        </label>
      </div>
    </template>
  </Modal>
</template>

<style scoped lang="scss">
* {
  vertical-align: middle;
}
.order {
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-color: rgb(235, 235, 235);
  border-radius: 5px;

  &:first-child {
    text-align: left;
  }

  &:last-child {
    text-align: right;
  }

  h4 {
    margin: 0;
  }

  .number {
    padding: 5px 1rem;
    color: white;
    background-color: var(--red);
    border-radius: 5px;
  }

  .balance {
    padding: 0 1rem;
  }
  .btn-group {
    background-color: white;
    border-radius: 10px;

    .text-success {
      font-weight: 700;
    }

    .bg-success {
      border-top-left-radius: 0;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 0;
    }
  }
}

.input-group-append button {
  padding: 5px 0.5rem;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}

select {
  border-radius: inherit;
}
</style>

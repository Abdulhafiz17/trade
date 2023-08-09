<script>
import Receipt from "../../components/Order/Receipt.vue";
import api from "../../server/api";
import Orders from "./Orders.vue";
import Trades from "./Trades.vue";
export default {
  name: "Order",
  components: { Orders, Trades, Receipt },
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
      customer: null,
      loan_price: 0,
      seller: null,
      order_confirm: {
        order_id: 0,
        customer_name: "",
        customer_phone: "",
        customer_type: "",
        discount: 0,
        money: [
          {
            paid_money: 0,
            type: "naqd",
          },
        ],
        loan_repayment_date: null,
        seller_id: 0,
        muddat: 0,
        percent: 0,
        date: null,
      },
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
    residual_payment() {
      let residual = this.balance;
      this.order_confirm.money.forEach((item) => {
        residual -= item.paid_money;
      });
      residual -= this.order_confirm.discount;
      residual -= this.loan_price;
      return residual || 0;
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
        console.log(res.data);
        this.order = res.data.data[0];
        this.$nextTick(() => {
          this.$refs.trades.getTrades();
        });
      });
    },
    changeOrder() {
      this.$refs.trades.getTrades();
    },
    putOrder() {
      this.order_confirm.order_id = this.order?.Orders.id;
      const year = new Date().getFullYear()
      const month = new Date().getMonth()
      const today = new Date().getDate()
      const hour = new Date().getHours()
      const minutes = new Date().getMinutes()
      const second = new Date().getSeconds()
      this.order_confirm.date = `${year}-${month}-${today}`
      this.order_confirm.customer_phone = this.seller.phone
      this.order_confirm.customer_name = this.customer.phone
      console.log(this.order_confirm.customer_name)
      api.order_confirmation(this.order_confirm).then(res => {
        this.$util.toast('confirm_order').then(() => {
          this.confirm_order = {
            customer_name: null,
            customer_phone: null,
            customer_birthday: null,
            customer_type: null,
            discount: null,
            money: [
              {
                paid_money: null,
                type: "naqd",
              },
              {
                paid_money: null,
                type: "plastik",
              },
            ],
            loan_repayment_date: null,
            seller_id: 0,
          };
          this.$refs.order_check.start(this.order_confirm.order_id)
        })
      })
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
          <Orders ref="orders" v-model:order="order" :orders="orders" @update:order="
            $nextTick(() => {
              changeOrder();
            })
            " />
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
          <button class="btn-group p-0 btn btn-outline-light" @click="$refs.confirmModal.openModal()">
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
      <form class="row gap-1" id="confirm-order" @submit.prevent="putOrder()">
        <div class="col-12">
          <div class="row">
            <div class="col">
              <button type="button" class="btn btn-light w-100" :class="{ 'text-light bg-primary': customer_type == '' }"
                @click="customer_type = ''">
                Umumiy
              </button>
            </div>
            <div class="col">
              <button type="button" class="btn btn-light w-100" :class="{
                'text-light bg-primary': customer_type == 'customer',
              }" @click="customer_type = 'customer'">
                Doimiy
              </button>
            </div>
            <div class="col">
              <button type="button" class="btn btn-light w-100"
                :class="{ 'text-light bg-primary': customer_type == 'new' }" @click="customer_type = 'new'">
                Yangi
              </button>
            </div>
          </div>
        </div>
        <div class="col-12" v-if="customer_type == 'customer'">
          Mijoz
          <DataDropdown type="customer" property="name" v-model="customer"></DataDropdown>
        </div>
        <div class="col-12" v-if="customer_type == 'new'">
          <div class="row">
            <label class="col-md-6">
              Ism
              <input type="text" class="form-control" required v-model="order_confirm.customer_name" />
            </label>
            <label class="col-md-6">
              Telefon raqam
              <div class="input-group" :tel="$util.tel(order_confirm.customer_phone)">
                <div class="input-group-text">+998</div>
                <input type="tel" class="form-control" minlength="9" maxlength="9" required
                  v-model="order_confirm.customer_phone" />
              </div>
            </label>
            <label class="col-md-12">
              Toifa
              <select class="form-select" required v-model="order_confirm.customer_type">
                <option value="Premium">Premium</option>
              </select>
            </label>
          </div>
        </div>
        <label class="col-12">
          To'lov summa
          <div class="row gap-1">
            <div class="col-12" v-for="(item, i) in order_confirm.money" :key="item">
              <div class="input-group" :currency="$util.currency(item.paid_money)">
                <input type="number" class="form-control" min="0" step="any" required v-model="item.paid_money" />
                <div class="input-group-text">so'm</div>
                <div class="input-group-append">
                  <select class="form-select" required v-model="item.type">
                    <option hidden value="">to'lov turi</option>
                    <option v-for="item1 in $util.payment_types" :key="item1" :value="item1" :disabled="order_confirm.money.find((item2) => item2.type == item1)
                      ">
                      {{ item1 }}
                    </option>
                  </select>
                </div>
                <div class="input-group-text cursor" @click="item.paid_money = residual_payment">
                  <i class="fa fa-money-bill"></i>
                </div>
                <div class="input-group-append">
                  <button class="btn-success" @click="
                    order_confirm.money.push({
                      paid_money: 0,
                      type: '',
                    })
                    " v-if="i == 0 && order_confirm.money.length < 3">
                    <img src="../../assets/icons/Add_square.svg" alt="Add_square" />
                  </button>
                  <button class="btn-danger" @click="order_confirm.money.splice(i, 1)" v-else>
                    <img src="../../assets/icons/del_alt.svg" alt="del_alt" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </label>
        <label class="col-12">
          Chegirma summa
          <div class="input-group" :currency="$util.currency(order_confirm.discount)">
            <input type="number" class="form-control" min="0" step="any" required v-model="order_confirm.discount" />
            <div class="input-group-text">so'm</div>
            <div class="input-group-text cursor" @click="order_confirm.discount = residual_payment">
              <i class="fa fa-money-bill"></i>
            </div>
          </div>
        </label>
        <label class="col-12" v-if="customer_type !== ''">
          Nasiya summa
          <div class="input-group" :currency="$util.currency(loan_price)">
            <input type="number" class="form-control" min="0" step="any" required v-model="loan_price" />
            <div class="input-group-text">so'm</div>
            <div class="input-group-text cursor" @click="loan_price = residual_payment">
              <i class="fa fa-money-bill"></i>
            </div>
          </div>
        </label>
        <label class="col-12" v-if="loan_price">
          Nasiyani qaytarish sana
          <div class="input-group">
            <input type="date" class="form-control" required v-model="order_confirm.loan_repayment_date" />
          </div>
        </label>
        <div class="col-12">
          Hodim
          <DataDropdown type="user" property="name" v-model="seller"></DataDropdown>
        </div>
      </form>
    </template>
    <template #footer>
      <button class="btn btn-success" form="confirm-order" @click="closeModal">
        <img src="../../assets/icons/Done_round-white.svg" alt="Done_round-white" />
      </button>
    </template>
  </Modal>

  <Receipt ref="order_check" />
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

.input-group select {
  border-radius: inherit;
}
</style>

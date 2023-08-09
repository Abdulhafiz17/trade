<script>
import api from "../../server/api";
export default {
  name: "Receipt",
  data() {
    return {
      order_id: null,
      order: null,
      branch: null,
      logo: null,
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.getBranch();
  },
  methods: {
    getBranch() {
      api.get_branch({ branch_id: this.current_user.branch_id }).then((res) => {
        this.branch = res.data.Branches;
        this.logo = res.data.file;
      });
    },
    start(id) {
      this.order_id = id;
      this.getOrder();
      this.createQrcode();
    },
    getOrder() {
      const param = {
        branch_id: 0,
        order_id: this.order_id,
        seller_id: 0,
        user_id: 0,
        customer_id: 0,
        status: "",
        from_time: "",
        to_time: "",
        page: 0,
        limit: 1,
      };
      api.get_orders(param).then((res) => {
        this.order = res.data;
        console.log(this.order);
        console.log(res.data);
        this.getTrades();
      });
    },
    getTrades() {
      const param = {
        order_id: this.order_id,
        branch_id: this.current_user.branch_id,
      };
      api.get_trades(param).then((res) => {
        this.order.balance = res.data.order_balance;
        this.order.trades = res.data.trades;
        this.order.sum_trade_quantity = this.order.trades.reduce(
          (total, item) => total + item.sum_quantity,
          0
        );
        this.order.sum_trade_price = this.order.trades.reduce(
          (total, item) => total + item.Trades.price,
          0
        );
        this.order.sum_trade_discount = this.order.trades.reduce(
          (total, item) => total + item.Trades.discount,
          0
        );
        this.getIncomes();
      });
    },
    getIncomes() {
      const param = {
        source: this.order_id,
        status: "order",
        page: 0,
        limit: 25,
      };
      api.get_incomes(param).then((res) => {
        this.order.incomes = res.data.data;
        // this.$refs.receiptModal.openModal();
        this.printReceipt();
      });
    },
    createQrcode() {
      let element = document.querySelector("#qrcode");
      element.innerHTML = "";
      new QRCode(element, {
        text: this.order_id,
        width: 100,
        height: 100,
        colorDark: "black",
      });
    },
    printReceipt() {
      this.$nextTick(() => {
        const element = document.querySelector("#receipt").outerHTML;
        const winPrint = window.open("", "_blank");
        winPrint.document.head.innerHTML += `
                  <style>
                      * {
                          margin: 0;
                          padding: 0;
                          box-sizing: border-box;
                          font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
                      }

                      @page {
                        margin: 0;
                        size: auto;
                      }

                      @meida print {
                          .receipt {
                              width: 100%;
                          }
                      }

                      hr {
                      margin: 0.5rem 0;
                      }

                      .receipt {
                      padding: 1rem;
                      width: 390px;
                      border: thin solid lightgray;
                      }

                      .receipt-image {
                      padding: 0.5rem;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      margin-bottom:4px;
                      }

                      .receipt-image img {
                      width: 50%;
                      }

                      .receipt-image#qrcode img {
                      width: 30%;
                      }

                      .trade-branch{
                        width:70%;
                        margin: 0 auto;
                        text-align:center;
                      }

                      .receipt-body .order div {
                      display: flex;
                      justify-content: space-between;
                      }

                      .receipt-body .trades.header {
                      border-bottom: thin solid whitesmoke;
                      font-weight: 500;
                      }

                      .receipt-body .trades {
                      display: flex;
                      margin-bottom:4px;
                      }

                      .receipt-body .trades div {
                      font-size: small;
                      }

                      .receipt-body .trades div:nth-child(1) {
                      flex: 3;
                      text-align: start;
                      }

                      .receipt-body .trades div:nth-child(2) {
                      flex: 1;
                      text-align: center;
                      }

                      .receipt-body .trades div:nth-child(3) {
                      flex: 2;
                      text-align: end;
                      }

                       .thanks span {
                        display:block;
                      text-align: center;
                      }
                  </style>
              `;
        winPrint.document.body.innerHTML = element;
        setTimeout(() => {
          winPrint.print();
          winPrint.close();
        }, 100);
      });
    },
  },
};
</script>

<template>
  <div v-show="false">
    <div id="receipt" class="receipt">
      <div class="receipt-image">
        <img :src="$baseurl + '/uploaded_files/' + logo" alt="logo" />
      </div>
      <p class="trade-branch" v-if="branch">{{ branch.name + " " + branch.address }}</p>
      <div class="receipt-location">
      </div>
      <div class="receipt-body">
        <div class="order">
          <div>
            <span>Sana va vaqt</span>
            <span>{{ order?.Orders?.time.substring(0, 10) }} {{ order?.Orders?.time.substring(11, 16) }}</span>
          </div>
          <hr />
          <div>
            <span>Sotuvchi</span>
            <span>{{ order?.user?.name }}</span>
          </div>
          <div>
            <span>Sotuvchi ID</span>
            <span>{{ order?.user?.id }}</span>
          </div>
          <div>
            <span>Mijoz</span>
            <span>{{ order?.Customers?.name || "" }}</span>
          </div>
          <div>
            <span>Mahsulotlar soni</span>
            <span>{{ order?.sum_trade_quantity }} dona</span>
          </div>
        </div>
        <hr />
        <div class="trades header">
          <div>Mahsulot</div>
          <div>Miqdor</div>
          <div>Narx</div>
        </div>
        <div class="trades" v-for="item in order?.trades" :key="item">
          <div>
            {{
              item.Trades.product?.category.name +
              " - " +
              item.Trades.product?.product_type.name +
              " - " +
              item.Trades.product?.product_type.name2
            }}
          </div>
          <div>
            {{ item.sum_quantity }} {{ item.Trades.product.olchov_birligi }}
          </div>
          <div>
            {{
              $util.currency(
                (item.Trades.price - item.Trades.discount) * item.sum_quantity
              )
            }}
            so'm
          </div>
        </div>
        <hr />
        <div class="order">
          <div v-for="item in order?.incomes" :key="item">
            <span>{{ $util.captalize(item.Incomes.type) }}</span>
            <span>
              {{ $util.currency(item.Incomes.money) }}
              so'm
            </span>
          </div>
          <hr />
          <div>
            <span>Jami</span>
            <span>{{ $util.currency(order?.balance) }} so'm</span>
          </div>
        </div>
        <hr />
        <div class="thanks">
          <span>Xaridingiz uchun rahmat!</span>
          <span>Спасибо за покупку!</span>
          <span>Thank you for your purchase!</span>
        </div>
      </div>
      <div id="qrcode" class="receipt-image"></div>
    </div>
  </div>
  <!-- <Modal ref="receiptModal">
    <template #body> </template>
  </Modal> -->
</template>

<style scoped>
img {
  width: auto;
}

hr {
  margin: 0.5rem 0;
}

.receipt {
  padding: 1rem;
  width: 390px;
  border: thin solid lightgray;
}

.receipt-image {
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.receipt-image img {
  width: 50%;
}

.receipt-image#qrcode img {
  width: 30%;
}

.receipt-body .order div {
  display: flex;
  justify-content: space-between;
}

.receipt-body .trades.header {
  border-bottom: thin solid whitesmoke;
  font-weight: 500;
}

.receipt-body .trades {
  display: flex;
}

.receipt-body .trades div {
  font-size: small;
}

.receipt-body .trades div:nth-child(1) {
  flex: 3;
  text-align: start;
}

.receipt-body .trades div:nth-child(2) {
  flex: 1;
  text-align: center;
}

.receipt-body .trades div:nth-child(3) {
  flex: 2;
  text-align: end;
}
</style>

<script>
import api from "../../server/api";
import Order from "../../components/Order/Order.vue";
import Trades from "../../components/Order/Trades.vue";
import ReturnedProducts from "./ReturnedProducts.vue";
export default {
  name: "Return",
  components: { Order, Trades, ReturnedProducts },
  data() {
    return {
      order_id: null,
      product: null,
      return_product: {
        trade_id: null,
        quantity: null,
        price: null,
      },
    };
  },
  created() {
    this.order_id = Number(this.$route.query.order_id) || null;
  },
  mounted() {
    if (this.order_id) this.get();
  },
  methods: {
    get() {
      this.$refs.order.getOrder();
      this.$refs.trades.getTrades();
    },
    setProduct(product) {
      this.product = product;
      this.$refs.returnModal.openModal();
    },
    returnProduct() {
      this.return_product.trade_id = this.product.Trades.id;
      api.return_product(this.return_product).then(() => {
        this.return_product = {
          trade_id: null,
          quantity: null,
          price: null,
        };
        this.$util.toast().then(() => {
          this.$refs.returnModal.closeModal();
          this.$router.replace({ path: "/return" });
        });
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
          <h2 class="title">MAHSULOT QAYTARISH</h2>
        </div>
        <div class="col-md-6"></div>
      </div>
    </div>
    <div class="col-12">
      <Tab :tabs="[`Mahsulot qaytarish`, `Qaytarilgan mahsulotlar`]">
        <template #1>
          <div class="row gap-2">
            <div class="col-4">
              <form class="input-group" @submit.prevent="get()">
                <input
                  type="number"
                  class="form-control"
                  placeholder="order id:"
                  required
                  v-model="order_id"
                />
                <div class="input-group-append">
                  <button class="btn btn-primary">
                    <img
                      src="../../assets/icons/Search_alt.svg"
                      alt="Search_alt"
                    />
                  </button>
                </div>
              </form>
            </div>
            <div class="col-12">
              <Order :order-id="order_id" ref="order" />
              <Trades
                returnable
                :order-id="order_id"
                @open-modal="setProduct($event)"
                ref="trades"
              />
            </div>
          </div>
        </template>
        <template #2>
          <ReturnedProducts />
        </template>
      </Tab>
    </div>
  </div>

  <Modal ref="returnModal">
    <template #header>
      <h5>Mahsulot qaytarish</h5>
      <p>
        {{
          product?.Trades?.product?.category.name +
          " - " +
          product?.Trades?.product?.product_type.name +
          " - " +
          product?.Trades?.product?.product_type.name2
        }}
      </p>
      <strong>{{ $util.currency(product?.Trades?.price) }} so'm</strong>
    </template>
    <template #body>
      <form
        class="row gap-2"
        id="return-product-form"
        @submit.prevent="returnProduct()"
      >
        <label class="col-12">
          Summa
          <div
            class="input-group"
            :currency="$util.currency(return_product.price)"
          >
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              required
              v-model="return_product.price"
            />
            <div class="input-group-text">so'm</div>
          </div>
        </label>
        <label class="col-12">
          Hajm
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              required
              v-model="return_product.quantity"
            />
            <div class="input-group-text">
              {{ product?.Trades?.product?.olchov_birligi }}
            </div>
          </div>
        </label>
      </form>
    </template>
    <template #footer>
      <button class="btn btn-success" form="return-product-form">
        <img
          src="../../assets/icons/Done_round-white.svg"
          alt="Done_round-white"
        />
      </button>
    </template>
  </Modal>
</template>

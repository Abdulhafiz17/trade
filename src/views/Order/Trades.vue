<script>
import api from "../../server/api";
import Products from "../Product/Products.vue";
import ProductModal from "../../components/Product/ProductModal.vue";
export default {
  components: {
    Products,
    ProductModal
  },
  name: "Trades",
  props: {
    order: null,
  },
  data() {
    return {
      code: "",
      search: "",
      count: 0,
      product: null,
      units: [],
      unit_id: 0,
      unit_quantity: 0,
      composition_status: false,
      composition: null,
      trade: {
        code: 0,
        o_pr_id: 0,
        pr_comp_id: 0,
        quantity: 0,
        price: 0,
        discount: 0,
        order_id: 0,
        status: true,
      },
      searchProduct: "",
      status: ["quantity_false", "quantity_true", "price_false", "price_true"],
      trades: [],
      products: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      prdct: [],
      currencies: []
    };
  },
  methods: {
    getTrades() {
      if (this.order) {
        const param = {
          order_id: this.order.Orders.id,
          branch_id: this.$parent.current_user.branch_id,
        };
        api.get_trades(param).then((res) => {
          console.log(res.data.trades);
          this.trades = res.data.trades;
          this.$parent.balance = res.data.order_balance;
          this.trades.forEach((item, i) => {
            this.prdct.push({ count: 1 })
          })
        });
      } else this.trades = [];
    },
    createTrade() {
      this.trade.pr_comp_id = this.composition?.id || 0;
      api.to_trade(this.trade).then(() => {
        this.code = "";
        this.composition_status = false;
        this.composition = null;
        this.$refs.addTradeModal.closeModal();
        this.$util.toast().then(() => {
          this.getTrades();
        });
      });
    },
    updateTrade(item) {
      const data = {
        code: item.Trades.product.code,
        o_pr_id: item.Trades.opened_pr_id,
        pr_comp_id: item.Trades.pr_comp_id,
        quantity: item.sum_quantity,
        price: item.Trades.price,
        discount: item.Trades.discount,
        order_id: item.Trades.order_id,
        status: true,
      };
      api.update_trade(data).then(
        () => {
          this.$util.toast().then(() => {
            this.getTrades();
          });
        },
        () => {
          this.getTrades();
        }
      );
    },
    removeTrade(id) {
      api.remove_trade({ trade_id: id }).then(() => {
        this.$util.toast().then(() => {
          this.getTrades();
        });
      });
    },
    // getProductsForTrade() {
    //   // for (let i = 0; i < this.trades.length; i++) {
    //   //   if (this.trades[i]?.Trades?.product.category.name == this.code || this.trades[i]?.Trades?.product.product_type.name == this.code) {
    //   //     this.product = [this.trades[i]]
    //   //     this.trade = {
    //   //       code: this.product.Products.code,
    //   //       o_pr_id: 0,
    //   //       pr_comp_id: 0,
    //   //       quantity: 1,
    //   //       price: this.product.vitrina,
    //   //       discount: 0,
    //   //       order_id: this.order.Orders.id,
    //   //       status: true,
    //   //     };
    //   //     this.getProductUnits();
    //   //   }
    //   // }
    //   // if (this.code)
    //   //   api.get_products_for_trade({ code: this.code }).then((res) => {
    //   //     if (res.data) {
    //   //       this.product = res.data;
    //   //       this.trade = {
    //   //         code: this.product.Products.code,
    //   //         o_pr_id: 0,
    //   //         pr_comp_id: 0,
    //   //         quantity: 1,
    //   //         price: this.product.vitrina,
    //   //         discount: 0,
    //   //         order_id: this.order.Orders.id,
    //   //         status: true,
    //   //       };
    //   //       this.getProductUnits();
    //   //     } else {
    //   //       this.$util.toast("warning", "Mahsulot mavjud emas !");
    //   //       this.code = "";
    //   //     }
    //   //   });
    // },
    getProductUnits() {
      api.get_olchov_birliglar({ code: this.code }).then((res) => {
        this.units = res.data;
        this.unit_id = 0;
        this.unit_quantity = 0;
        this.$refs.addTradeModal.openModal();
      });
    },
    countUnit() {
      let unit = this.units.find(({ id }) => {
        return id == this.unit_id;
      });
      if (unit) {
        this.trade.quantity = this.unit_quantity * unit.quantity;
      } else {
        this.trade.quantity = 0;
      }
    },
    focusInput() {
      const searchInput = document.querySelector('.search-input')
      const searchList = document.querySelector('.search-list')
      searchInput.addEventListener('keyup', () => {
        document.querySelector('.search-form').classList.add('form-active')
        this.getProducts()
      })
    },
    getProducts() {
      const param = {
        search: this.search,
        status: "price_true",
        branch_id: this.branch_id,
        page: 0,
        limit: 25,
      };
      // this.$store.dispatch("setLoading", false)
      api.get_products(param).then((res) => {
        this.products = res.data.data;
        console.log(this.products);
      });
    },
    selectProduct(item) {
      for (let cur = 0; cur < this.currencies.length; cur++) {
        if (this.order && item.last_currency.currency == this.currencies[cur].currency) {
          const trade = {
            tarozi_id: 0,
            code: item.Products.code,
            o_pr_id: 0,
            pr_comp_id: 0,
            quantity: 1,
            price: item.Products.vitrina_price * this.currencies[cur].price,
            discount: 0,
            order_id: this.order.Orders.id,
            status: "true",
          }
          api.to_trade(trade).then((res) => {
            this.code = "";
            this.composition_status = false;
            this.composition = null;
            this.getTrades();
            this.getProductUnits()
            this.search = ''
          });
        }
      }
      document.querySelector('.search-form').classList.remove('form-active')
    },
    onSearch() {
      this.$refs.productModal.search = this.searchProduct;
      this.$refs.productModal.getProducts();
      this.searchProduct = ""
    },
    getCurrency() {
      api.get_currencies().then(res => {
        this.currencies = res.data
      })
    },
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
    branch_id() {
      return this.$route.query.branch_id || this.current_user.branch_id;
    },
    options() {
      return this.$props.edit || this.$props.barcode;
    },
  },
  created() {
    this.getCurrency()
  },
};
</script>

<template>
  <div class="row">
    <div class="col-md-8 py-1">
      <form class="input-group input-group-sm search-form" @click="focusInput">
        <input type="search" class="form-control search-input" placeholder="Mahsulot izlash:" v-model="search"
          :disabled="!order" />
        <button class="btn btn-success">
          <img src="../../assets/icons/Search_alt.svg" alt="" />
        </button>
        <div class="product-search-box bg-white rounded-2 border p-2">
          <ul class="list-unstyled mb-0 search-list">
            <li v-if="products.length" v-for="item in products" :key="item" @click="selectProduct(item)">{{ item.category
              +
              " - " + item.Products.product_type.name + " - " + item.Products.product_type.name2 }}
            </li>
          </ul>
        </div>
      </form>
    </div>
    <div class="col-md-4 py-1">
      <button class="btn btn-sm btn-primary w-100" data-bs-toggle="modal"
        data-bs-target="#staticBackdrop">Mahsulotlar</button>
    </div>
  </div>
  <div class="table-responsive py-1 pt-4" style="height: 60vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>№</th>
          <th>Mahsulot</th>
          <th>Hajm</th>
          <th>Narx</th>
          <th>Chegirma</th>
          <th>To'lov</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in trades" :key="item">
          <td>{{ i + 1 }}</td>
          <td>
            {{
              item.Trades.product.category.name +
              " - " +
              item.Trades.product.product_type.name +
              " - " +
              item.Trades.product.product_type.name2
            }}
            <p v-if="item.Trades.product_composition">
              {{ item.Trades.product_composition.name }}
            </p>
          </td>
          <td>
            <div class="input-group input-group-sm">
              <input type="number" class="form-control" min="0" step="any" placeholder="hajm:" v-model="prdct[i].count"
                @change="updateTrade(item)" />
              <div class="input-group-text">dona</div>
            </div>
          </td>
          <td>
            <div class="input-group input-group-sm" :currency="$util.currency(item.Trades.price)">
              <input type="number" class="form-control" min="0" step="any" placeholder="hajm:" v-model="item.Trades.price"
                @change="updateTrade(item)" />
              <div class="input-group-text hover-price position-relative">so'm
                <div class="hover-box position-absolute">
                  <div class="d-flex me-1">
                    <p class="text-white price-text">Vitrina narxi: </p>
                    <p class="text-white price-text" v-if="item.Trades.product.currency.currency == '$'">{{
                      item.Trades.product.vitrina_price * 11650 }}</p>
                    <p class="text-white price-text" v-if="item.Trades.product.currency.currency != '$'">{{
                      item.Trades.product.vitrina_price }}</p>
                  </div>
                  <div class="d-flex me-1">
                    <p class="text-white price-text">Minimal narxi: </p>
                    <p class="text-white price-text" v-if="item.Trades.product.currency.currency == '$'">{{
                      item.Trades.product.last_price * 11650 }}</p>
                    <p class="text-white price-text" v-if="item.Trades.product.currency.currency != '$'">{{
                      item.Trades.product.last_price }}</p>
                  </div>
                  <div class="d-flex ">
                    <p class="text-white price-text">Sotuv narxi: </p>
                    <p class="text-white price-text" v-if="item.Trades.product.currency.currency == '$'">{{
                      item.Trades.product.sotuv_price * 11650 }}</p>
                    <p class="text-white price-text" v-if="item.Trades.product.currency.currency != '$'">{{
                      item.Trades.product.sotuv_price }}</p>
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="input-group input-group-sm" :currency="$util.currency(item.Trades.discount)">
              <input type="number" class="form-control" min="0" step="any" placeholder="hajm:"
                v-model="item.Trades.discount" @change="updateTrade(item)" />
              <div class="input-group-text">so'm</div>
            </div>
          </td>
          <td>
            {{
              $util.currency(
                (item.Trades.price - item.Trades.discount) * prdct[i].count
              ) + " so'm"
            }}
          </td>
          <td>
            <button class="delete" @click="removeTrade(item.Trades.id)">
              <img src="../../assets/icons/del_alt.svg" alt="del_alt" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="modal fade" id="staticBackdrop" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <button type="button" class="d-block me-0 ms-auto btn-close mb-3" data-bs-dismiss="modal"
            aria-label="Close"></button>
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Mahsulotlar</h1>
            <form @submit.prevent="onSearch">
              <div class="input-group">
                <input type="search" class="form-control" placeholder="Qidiruv:" v-model="searchProduct" />
                <button class="btn btn-primary" type="submit">
                  <img src="../../assets/icons/Search_alt.svg" alt="Search_alt" />
                </button>
              </div>
            </form>
          </div>
          <Tab :tabs="[`Narx belgilangan`, `Narx belgilanmagan`, `Qoldiq tugagan`]">
            <template #1>
              <ProductModal status="price_true" edit barcode info ref="productModal" />
            </template>
            <template #2>
              <ProductModal status="price_false" edit ref="productModal" />
            </template>
            <template #3>
              <ProductModal status="quantity_false" ref="productModal" />
            </template>
          </Tab>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
form {
  position: relative;
}

.product-search-box {
  display: none;
}

.form-active .product-search-box {
  position: absolute;
  display: block;
  top: 40px;
  width: 100%;
  z-index: 3;
}

.search-list {
  & li {
    cursor: pointer;
  }
}

table {
  font-size: small;

  td {
    vertical-align: middle;
  }

  .delete {
    padding: 2px 5px;
    background-color: var(--red);

    img {
      width: 20px;
    }
  }
}

.modal-dialog {
  max-width: 80%;
}

.modal-body {
  height: 60vh;
  overflow-y: scroll;
}

.hover-price {
  transition: 0.5s ease;

  .hover-box {
    content: "";
    transform: scale(0)
  }

  .price-text {
    font-size: 14px;
    line-height: 18px;
  }

  &:hover .hover-box {
    top: -50px;
    right: 0;
    border-radius: 4px;
    padding: 4px;
    z-index: 2;
    color: #fff;
    background-color: darkslategray;
    transform: scale(1);
  }
}


.selected {
  background-color: var(--bs-success);

  * {
    color: whitesmoke;
  }
}
</style>

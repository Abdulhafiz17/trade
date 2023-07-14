<script>
import api from "../../server/api";
export default {
  name: "Trades",
  props: {
    order: null,
  },
  data() {
    return {
      code: "",
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
      trades: [],
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
          this.trades = res.data.trades;
          this.$parent.balance = res.data.order_balance;
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
    getProductsForTrade() {
      if (this.code)
        api.get_products_for_trade({ code: this.code }).then((res) => {
          if (res.data) {
            this.product = res.data;
            this.trade = {
              code: this.product.Products.code,
              o_pr_id: 0,
              pr_comp_id: 0,
              quantity: 1,
              price: this.product.vitrina,
              discount: 0,
              order_id: this.order.Orders.id,
              status: true,
            };
            this.getProductUnits();
          } else {
            this.$util.toast("warning", "Mahsulot mavjud emas !");
            this.code = "";
          }
        });
    },
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
  },
};
</script>

<template>
  <div class="row">
    <div class="col-md-8 py-1">
      <form
        class="input-group input-group-sm"
        @submit.prevent="getProductsForTrade()"
      >
        <input
          type="search"
          class="form-control"
          placeholder="Mahsulot code:"
          v-model="code"
          :disabled="!order"
        />
        <button class="btn btn-success">
          <img src="../../assets/icons/Add_square.svg" alt="" />
        </button>
      </form>
    </div>
    <div class="col-md-4 py-1">
      <button class="btn btn-sm btn-primary w-100">Mahsulotlar</button>
    </div>
  </div>
  <div class="table-responsive py-1" style="height: 60vh">
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
              <input
                type="number"
                class="form-control"
                min="0"
                step="any"
                placeholder="hajm:"
                v-model="item.sum_quantity"
                @change="updateTrade(item)"
              />
              <div class="input-group-text">dona</div>
            </div>
          </td>
          <td>
            <div
              class="input-group input-group-sm"
              :currency="$util.currency(item.Trades.price)"
            >
              <input
                type="number"
                class="form-control"
                min="0"
                step="any"
                placeholder="hajm:"
                v-model="item.Trades.price"
                @change="updateTrade(item)"
              />
              <div class="input-group-text">so'm</div>
            </div>
          </td>
          <td>
            <div
              class="input-group input-group-sm"
              :currency="$util.currency(item.Trades.discount)"
            >
              <input
                type="number"
                class="form-control"
                min="0"
                step="any"
                placeholder="hajm:"
                v-model="item.Trades.discount"
                @change="updateTrade(item)"
              />
              <div class="input-group-text">so'm</div>
            </div>
          </td>
          <td>
            {{
              $util.currency(
                (item.Trades.price - item.Trades.discount) * item.sum_quantity
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

  <Modal ref="addTradeModal">
    <template #header>
      <h5>Mahsulot qo'shish</h5>
      <p>
        {{
          product.Products.category.name +
          " - " +
          product.Products.product_type.name +
          " - " +
          product.Products.product_type.name2
        }}
      </p>
      <strong>{{ $util.currency(product.vitrina) + " so'm" }}</strong>
    </template>
    <template #body>
      <form class="row gap-2" @submit.prevent="createTrade()" id="trade-form">
        <div class="col-12">
          <button
            type="button"
            class="btn btn-light w-100"
            :class="composition_status ? 'bg-primary text-light' : ''"
            @click="composition_status = !composition_status"
          >
            Qismga bo'lib sotish
            <i class="fa fa-check" v-if="composition_status"></i>
          </button>
        </div>
        <div class="col-12" v-if="composition_status">
          <div class="list-group border">
            <li
              class="list-group-item"
              :class="{ selected: item == composition }"
              v-for="item in product.Products.product_type.product_composition"
              :key="item"
              @click="composition ? (composition = null) : (composition = item)"
            >
              <p>{{ item.name }}</p>
              <span>{{ item.quantity + " " + item.olchov_birligi }}</span>
            </li>
          </div>
        </div>
        <label class="col-12">
          Miqdor
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              v-model="unit_quantity"
            />
            <select class="form-select" v-model="unit_id" @change="countUnit()">
              <option v-for="item in units" :key="item" :value="item.id">
                {{ item.olchov }}
              </option>
            </select>
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              required
              v-model="trade.quantity"
            />
            <div class="input-group-text">dona</div>
          </div>
        </label>
        <label class="col-12">
          Narx
          <div class="input-group" :currency="$util.currency(trade.price)">
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              required
              v-model="trade.price"
            />
            <div class="input-group-text">so'm</div>
          </div>
        </label>
        <label class="col-12">
          Chegirma
          <div class="input-group" :currency="$util.currency(trade.discount)">
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              v-model="trade.discount"
            />
            <div class="input-group-text">so'm</div>
          </div>
        </label>
      </form>
    </template>
    <template #footer>
      <span>Mahsulot kiritilsinmi ?</span>
      <button class="btn btn-sm p-1 btn-success mx-2" form="trade-form">
        <img src="../../assets/icons/Add_square.svg" alt="Add_square" />
      </button>
      <button
        class="btn btn-sm p-1 btn-danger"
        @click="$refs.addTradeModal.closeModal()"
      >
        <img src="../../assets/icons/Cancel-white.svg" alt="Cancel-white" />
      </button>
    </template>
  </Modal>
</template>

<style scoped lang="scss">
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

.selected {
  background-color: var(--bs-success);

  * {
    color: whitesmoke;
  }
}
</style>

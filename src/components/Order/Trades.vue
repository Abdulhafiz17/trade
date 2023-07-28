<script>
import api from "../../server/api";
export default {
  name: "Trades",
  props: {
    orderId: Number,
    returnable: Boolean,
  },
  emits: {
    openModal: null,
  },
  data() {
    return {
      trades: [],
      returned_products: [],
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
    id() {
      return this.$props.orderId;
    },
  },
  created() {
    if (this.$props.orderId) {
      this.getTrades();
      this.getReturnedProducts();
    }
  },
  methods: {
    getTrades() {
      const param = {
        order_id: this.id,
        branch_id: this.current_user.branch_id,
      };
      api.get_trades(param).then((res) => {
        this.trades = res.data.trades;
      });
    },
    getReturnedProducts() {
      const param = {
        order_id: this.$props.orderId,
        branch_id: this.current_user.branch_id,
        page: 0,
        limit: 25,
      };
      api.get_returned_products(param).then((res) => {
        this.returned_products = res.data.data;
      });
    },
    returnedProduct(trade) {
      return this.returned_products.find((item) => {
        return item.Returned_products.trade_id == trade.Trades.id;
      });
    },
  },
};
</script>

<template>
  <div class="trades">
    <div class="table-responsive">
      <table class="table table-sm table-hover" v-if="trades.length">
        <thead>
          <tr>
            <th>№</th>
            <th>Mahsulot</th>
            <th>Hajm</th>
            <th>Narx</th>
            <th>Chegirma</th>
            <th>Qaytarilgan</th>
            <th>Summa</th>
            <th v-if="returnable && $route.path == '/return'"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in trades" :key="item">
            <td>{{ i + 1 }}</td>
            <td>
              {{
                item.Trades.product?.category.name +
                " - " +
                item.Trades.product?.product_type.name +
                " - " +
                item.Trades.product?.product_type.name2
              }}
              <p v-if="item.Trades.product_composition">
                {{ item.Trades.product_composition.name }}
              </p>
            </td>
            <td>
              {{ item.sum_quantity }} {{ item.Trades.product.olchov_birligi }}
            </td>
            <td>{{ $util.currency(item.Trades.price) }} so'm</td>
            <td>{{ $util.currency(item.Trades.discount) }} so'm</td>
            <td>
              {{ returnedProduct(item)?.Returned_products?.quantity || 0 }}
              {{ item.Trades.product.olchov_birligi }}
            </td>
            <td>
              {{
                $util.currency(
                  (item.Trades.price - item.Trades.discount) * item.sum_quantity
                ) + " so'm"
              }}
            </td>
            <td v-if="returnable">
              <button
                class="btn btn-sm btn-outline-info"
                @click="$emit('openModal', item)"
                :disabled="
                  item.sum_quantity <=
                  returnedProduct(item)?.Returned_products?.quantity
                "
              >
                <i class="fa fa-undo"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.trades {
  padding: 1rem;
}
</style>

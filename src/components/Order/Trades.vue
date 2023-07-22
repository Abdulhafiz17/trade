<script>
import api from "../../server/api";
export default {
  name: "Trades",
  props: {
    orderId: Number,
  },
  data() {
    return {
      trades: [],
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
    if (this.$props.orderId) this.getTrades();
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
            <th>Summa</th>
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
            <td>{{ item.sum_quantity }} dona</td>
            <td>{{ $util.currency(item.Trades.price) }} so'm</td>
            <td>{{ $util.currency(item.Trades.discount) }} so'm</td>
            <td>
              {{
                $util.currency(
                  (item.Trades.price - item.Trades.discount) * item.sum_quantity
                ) + " so'm"
              }}
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

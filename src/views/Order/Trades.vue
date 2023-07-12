<script>
import api from "../../server/api";
export default {
  name: "Trades",
  props: {
    order: null,
  },
  data() {
    return {
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
      let request = true;
      for (item in data) {
        if (!data["quantity"]) request = false;
      }
      if (request)
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
  },
};
</script>

<template>
  <div class="row">
    <div class="col-md-8 py-1">
      <div class="input-group input-group-sm">
        <input type="text" class="form-control" placeholder="Mahsulot code:" />
        <button class="btn btn-success">
          <img src="../../assets/icons/Add_square.svg" alt="" />
        </button>
      </div>
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
          <td>{{ i }}</td>
          <td>
            {{
              item.Trades.product.category.name +
              " - " +
              item.Trades.product.product_type.name +
              " - " +
              item.Trades.product.product_type.name2
            }}
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
                @input="updateTrade(item)"
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
                @input="updateTrade(item)"
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
                @input="updateTrade(item)"
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
</style>

<script>
import api from "../../server/api";
import EditSupplier from "./EditSupplier.vue";
import PaymentHistory from "./PaymentHistory.vue";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "User",
  components: { EditSupplier, PaymentHistory, Pagination },
  data() {
    return {
      supplier_id: this.$route.query.supplier_id,
      content: this.$route.query.content,
      supplier: {
        id: 0,
        address: "",
        phone: "",
        branch_id: 0,
        user_id: 0,
        name: "",
        balances: [
          {
            currency_id: 0,
            balance: 0,
            id: 0,
            currency: {
              currency: "",
              branch_id: 0,
              user_id: 0,
              price: 0,
              id: 0,
            },
          },
        ],
      },
      supplies: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.getSupplier();
  },
  methods: {
    getSupplier() {
      api.get_market({ market_id: this.supplier_id }).then((res) => {
        this.supplier = res.data;
      });
    },
    getSupplies() {
      const param = {
        category_id: 0,
        product_type_id: 0,
        market_id: this.supplier_id,
        party_id: 0,
        page: this.supplies.current_page,
        limit: this.supplies.limit,
      };
      api.get_supplies(param).then((res) => {
        this.supplies = res.data;
      });
    },
    changeTab(tab) {
      if (tab == 1) this.getSupplies();
    },
  },
};
</script>

<template>
  <div class="row gap-3">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">TA'MINOTCHI</h2>
        </div>
        <div class="col-md-6">
          <button
            class="btn btn-sm btn-primary float-end"
            @click="$router.go(-1)"
          >
            ⇽
          </button>
        </div>
      </div>
    </div>
    <div class="col-12" v-if="content == 'edit'">
      <EditSupplier :supplier="supplier" />
    </div>
    <div class="col-12" v-if="content == 'history'">
      <Tab :tabs="[`To'lovlar`, `Ta'minotlar`]" @change="changeTab($event)">
        <template #1>
          <PaymentHistory />
        </template>
        <template #2>
          <div class="table-responsive" style="max-height: 70vh">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Ta'minotchi</th>
                  <th>Kategoriya</th>
                  <th>Nomi</th>
                  <th>Marka</th>
                  <th>Miqdor</th>
                  <th>Narx</th>
                  <th>Summa</th>
                  <th>Sana</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in supplies.data" :key="item">
                  <td>{{ i + 1 }}</td>
                  <td>{{ item.market }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.product_name }}</td>
                  <td>
                    {{ item.product_name2 }}
                  </td>
                  <td>
                    {{ $util.currency(item.Supplies.quantity) }}
                    {{ item.Supplies.olchov_birligi }}
                  </td>
                  <td>
                    {{ $util.currency(item.Supplies.price) }}
                    {{ item.currency }}
                  </td>
                  <td>
                    {{
                      $util.currency(
                        item.Supplies.price * item.Supplies.quantity
                      )
                    }}
                    {{ item.currency }}
                  </td>
                  <td>
                    {{ item.Supplies.time.replace("T", " ").substring(0, 16) }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="9">
                    <Pagination v-model="supplies" @get="getSupplies" />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </template>
      </Tab>
    </div>
  </div>
</template>

<style scoped>
button {
  height: auto;
}
</style>

<script>
import api from "../../server/api";
import SupplyModal from "./SupplyModal.vue";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Supplies",
  components: { SupplyModal, Pagination },
  data() {
    return {
      status: this.$route.query.status,
      supplies: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.get();
  },
  methods: {
    get() {
      const param = {
        category_id: 0,
        product_type_id: 0,
        market_id: 0,
        party_id: this.$route.query.party_id,
        page: this.supplies.current_page,
        limit: this.supplies.limit,
      };
      api.get_supplies(param).then((res) => {
        this.supplies = res.data;
      });
    },
    remove(id) {
      api.remove_supply({ supply_id: id }).then(() => {
        this.$util.toast().then(() => {
          this.get();
        });
      });
    },
  },
};
</script>

<template>
  <div class="row gap-2">
    <div class="col-12" v-if="status == 'false'">
      <button class="btn btn-sm btn-success" @click="$refs.supplyModal.openModal()">
        <img src="../../assets/icons/Add_square.svg" alt="Add_square" />
        Mahsulot qo'shish
      </button>
    </div>
    <div class="col-12">
      <div class="table-responsive" style="max-height: 65vh">
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
              <th v-if="status == 'false'"></th>
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
                  $util.currency(item.Supplies.price * item.Supplies.quantity)
                }}
                {{ item.currency }}
              </td>
              <td v-if="status == 'false'">
                <button class="btn btn-sm btn-danger" @click="remove(item.Supplies.id)">
                  <img src="../../assets/icons/del_alt.svg" alt="del_alt" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="9">
                <Pagination v-model="supplies" @get="get" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>

  <SupplyModal @end="get()" ref="supplyModal" />
</template>

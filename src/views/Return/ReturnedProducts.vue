<script>
import api from "../../server/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "ReturnedProducts",
  components: { Pagination },
  data() {
    return {
      filter: {
        from_time: "",
        to_time: "",
      },
      returned_products: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.get();
  },
  methods: {
    get() {
      const param = {
        from_time: this.filter.from_time,
        to_time: this.filter.to_time,
        order_id: 0,
        branch_id: this.current_user.branch_id,
        page: this.returned_products.current_page,
        limit: this.returned_products.limit,
      };
      api.get_returned_products(param).then((res) => {
        this.returned_products = res.data;
      });
    },
  },
};
</script>

<template>
  <div class="row gap-1">
    <div class="col-12">
      <div class="table-reponsive" style="max-height: 70vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>№</th>
              <th>Mahsulot</th>
              <th>Hajm</th>
              <th>Hodim</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in returned_products.data" :key="item">
              <td>{{ i + 1 }}</td>
              <td>
                {{
                  item.Returned_products.trade.product.category.name +
                  " - " +
                  item.Returned_products.trade.product.product_type.name +
                  " - " +
                  item.Returned_products.trade.product.product_type.name2
                }}
                <p v-if="item.Returned_products.trade.product_composition">
                  {{ item.Returned_products.trade.product_composition.name }}
                </p>
              </td>
              <td>
                {{ item.Returned_products.quantity }}
                {{ item.Returned_products.trade.product.olchov_birligi }}
              </td>
              <td>{{ item.user }}</td>
              <td>
                {{
                  item.Returned_products.time.replace("T", " ").substring(0, 16)
                }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5">
                <Pagination v-model="returned_products" @get="get" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

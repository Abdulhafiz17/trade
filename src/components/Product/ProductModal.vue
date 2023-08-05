<script>
import api from "../../server/api";
import Barcode from "./Barcode.vue";
import Pagination from "../Pagination/Pagination.vue";
export default {
  name: "ProductModal",
  components: { Barcode, Pagination },
  props: {
    status: null,
    edit: Boolean,
    barcode: Boolean,
    info: Boolean,
  },
  data() {
    return {
      search: "",
      products: {
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
    branch_id() {
      return this.$route.query.branch_id || this.current_user.branch_id;
    },
    options() {
      return this.$props.edit || this.$props.barcode;
    },
  },
  created() {
    this.getProducts();
  },
  methods: {
    getProducts() {
      const param = {
        search: this.search,
        status: this.$props.status,
        branch_id: this.branch_id,
        page: this.products.current_page,
        limit: this.products.limit,
      };
      api.get_products(param).then((res) => {
        this.products = res.data;
      });
    },
  },
};
</script>

<template>
  <table class="table table-sm table-hover">
    <thead>
      <tr>
        <th>№</th>
        <th>Kodi</th>
        <th>Kategoriya</th>
        <th>Artikul</th>
        <th>Marka</th>
        <th>Polka</th>
        <th>Qoldiq</th>
        <th>Narx</th>
        <th>Tan narx</th>
        <th>Minimal narx</th>
        <th>Sotuv narx</th>
        <th>Vitrina narx</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, i) in products.data" :key="item">
        <td>{{ i + 1 }}</td>
        <td>{{ item.Products.code }}</td>
        <td>{{ item.Products.category.name }}</td>
        <td>{{ item.Products.product_type.name }}</td>
        <td>{{ item.Products.product_type.name2 }}</td>
        <td>{{ item.Products.cell?.name }}</td>
        <td>{{ $util.currency(item.sum_quantity) }} dona</td>
        <td>
          {{
            $util.currency(item.Products.price) +
            " " +
            item.Products.currency.currency
          }}
        </td>
        <td>
          {{
            $util.currency(item.Products.tan_narx) +
            " " +
            item.tan_narx_currency.currency
          }}
        </td>
        <td>
          {{
            $util.currency(item.Products.last_price) +
            " " +
            (item.last_currency?.currency || "")
          }}
        </td>
        <td>
          {{
            $util.currency(item.Products.sotuv_price) +
            " " +
            (item.sotuv_currency?.currency || "")
          }}
        </td>
        <td>
          {{
            $util.currency(item.Products.vitrina_price) +
            " " +
            (item.vitrina_currency?.currency || "")
          }}
        </td>
        <!-- <td v-if="options">
          <RouterLink class="btn btn-sm btn-warning mx-1" :to="{
            path: '/product',
            query: { product_code: item.Products.code, content: 'edit' },
          }" v-if="edit">
            <img src="../../assets/icons/Edit.svg" alt="Edit" />
          </RouterLink>
          <button class="btn btn-sm btn-primary mx-1" @click="$refs.barcode.start(item.Products.code)" v-if="true">
            <i class="fa fa-barcode"></i>
          </button>
          <RouterLink class="btn btn-sm btn-info mx-1" :to="{
            path: '/product',
            query: { product_code: item.Products.code, content: 'info' },
          }" v-if="info">
            <img src="../../assets/icons/Info.svg" alt="Info" />
          </RouterLink>
        </td> -->
      </tr>
    </tbody>

  </table>

  <Barcode ref="barcode" />
</template>

<style scoped lang="scss">
td:has(.btn) {
  text-align: center;
}

.btn {
  border-radius: 10px;
}
</style>

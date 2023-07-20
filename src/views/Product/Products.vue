<script>
import ProductsTable from "../../components/Product/ProductsTable.vue";
export default {
  name: "Products",
  components: { ProductsTable },
  data() {
    return {
      search: "",
      status: ["quantity_false", "quantity_true", "price_false", "price_true"],
    };
  },
  methods: {
    onSearch() {
      this.$refs.productsTable.search = this.search;
      this.$refs.productsTable.getProducts();
    },
  },
};
</script>

<template>
  <div class="row gap-3">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">MAHSULOTLAR</h2>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-10">
              <input
                type="search"
                class="form-control"
                placeholder="Qidiruv:"
                v-model="search"
              />
            </div>
            <div class="col-2">
              <button class="btn btn-primary" @click="onSearch()">
                <img src="../../assets/icons/Search_alt.svg" alt="Search_alt" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12">
      <Tab :tabs="[`Narx belgilangan`, `Narx belgilanmagan`, `Qoldiq tugagan`]">
        <template #1>
          <ProductsTable
            status="price_true"
            edit
            barcode
            info
            ref="productsTable"
          />
        </template>
        <template #2>
          <ProductsTable status="price_false" edit ref="productsTable" />
        </template>
        <template #3>
          <ProductsTable status="quantity_false" ref="productsTable" />
        </template>
      </Tab>
    </div>
  </div>
</template>

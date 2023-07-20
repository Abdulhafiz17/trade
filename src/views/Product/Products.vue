<script>
import ProductsTable from "../../components/Product/ProductsTable.vue";
export default {
  name: "Products",
  components: { ProductsTable },
  data() {
    return {
      search: "",
    };
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
              <button class="btn btn-primary">
                <img src="../../assets/icons/Search_alt.svg" alt="Search_alt" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12">
      <Tab :tabs="[`Narxlangan`]">
        <template #1>
          <ProductsTable edit barcode info />
        </template>
      </Tab>
    </div>
  </div>
</template>

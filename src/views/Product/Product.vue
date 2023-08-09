<script>
import api from "../../server/api";
import EditProduct from "../../components/Product/EditProduct.vue";
export default {
  name: "Product",
  components: { EditProduct },
  data() {
    return {
      product_code: this.$route.query.product_code,
      content: this.$route.query.content,
      product: {
        Products: {
          currency_id: 0,
          last_price: 0,
          id: 0,
          tan_narx: 0,
          last_currency_id: 0,
          code: 0,
          tan_narx_currency_id: 0,
          cell_id: 0,
          category_id: 0,
          vitrina_price: 0,
          user_id: 0,
          product_type_id: 0,
          vitrina_currency_id: 0,
          branch_id: 0,
          quantity: 0,
          sotuv_price: 0,
          olchov_birligi: "",
          sotuv_currency_id: 0,
          price: 0,
          category: {
            branch_id: 0,
            id: 0,
            name: "",
            user_id: 0,
          },
          olchovlar: [
            {
              id: 0,
              olchov: "",
              branch_id: 0,
              quantity: 0,
              code: 0,
            },
          ],
          product_type: {
            category_id: 0,
            name: "",
            branch_id: 0,
            id: 0,
            name2: "",
            product_composition: [],
          },
          currency: {
            price: 0,
            id: 0,
            branch_id: 0,
            user_id: 0,
            currency: "",
          },
          cell: null,
        },
        tan_narx_currency: {
          price: 0,
          id: 0,
          branch_id: 0,
          user_id: 0,
          currency: "",
        },
        vitrina_currency: {
          price: 0,
          id: 0,
          branch_id: 0,
          user_id: 0,
          currency: "",
        },
        sotuv_currency: {
          price: 0,
          id: 0,
          branch_id: 0,
          user_id: 0,
          currency: "",
        },
        last_currency: {
          price: 0,
          id: 0,
          branch_id: 0,
          user_id: 0,
          currency: "",
        },
        category: "",
        sum_quantity: 0,
      },
    };
  },
  created() {
    this.getProduct();
  },
  methods: {
    getProduct() {
      api.get_product({ code: this.product_code }).then((res) => {
        console.log(res.data);
      });
    },
  },
};
</script>

<template>
  <div class="row gap-3">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">MAHSULOT</h2>
        </div>
        <div class="col-md-6">
          <button class="btn btn-sm btn-primary float-end" @click="$router.go(-1)">
            ⇽
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <h5>
        {{
          product?.Products?.category?.name +
          " - " +
          product?.Products?.product_type?.name +
          " - " +
          product?.Products?.product_type?.name2
        }}
      </h5>
    </div>
    <div class="col-12">
      <EditProduct :product="product" v-if="content == 'edit'" />
    </div>
  </div>
</template>

<style scoped>
button {
  height: auto;
}
</style>

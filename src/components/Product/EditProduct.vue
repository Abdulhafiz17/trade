<script>
import api from "../../server/api";
export default {
  name: "EditProduct",
  props: {
    product: null,
  },
  data() {
    return {
      currencies: [],
      units: [],
      unit: {
        code: 0,
        olchov: "",
        quantity: 0,
      },
      composition: {
        product_type_id: 0,
        name: "",
        quantity: 0,
        olchov_birligi: "",
      },
    };
  },
  created() {
    this.getCurrencies();
    this.getUnits();
  },
  methods: {
    getCurrencies() {
      api.get_currencies().then((res) => {
        this.currencies = res.data;
      });
    },
    putProduct() {
      const data = {
        vitrina_price: this.product.Products.vitrina_price,
        vitrina_currency_id: this.product.Products.vitrina_currency_id,
        sotuv_price: this.product.Products.sotuv_price,
        sotuv_currency_id: this.product.Products.sotuv_currency_id,
        last_price: this.product.Products.last_price,
        last_currency_id: this.product.Products.last_currency_id,
        code: this.product.Products.code,
        cell_id: this.product.Products.cell_id,
      };
      api.update_product(data).then(() => {
        this.$util.toast();
      });
    },
    getUnits() {
      api
        .get_olchov_birliglar({ code: this.product.Products.code })
        .then((res) => {
          this.units = res.data;
        });
    },
    postUnit() {
      this.unit.code = this.product.Products.code;
      api.create_olchov_birligi(this.unit).then(() => {
        this.unit = {
          code: 0,
          olchov: "",
          quantity: 0,
        };
        this.$util.toast().then(() => {
          this.getUnits();
        });
      });
    },
    deleteUnit(item) {
      api.delete_olchov_birligi({ id: item.id }).then(() => {
        this.$util.toast().then(() => {
          this.getUnits();
        });
      });
    },
    postCompostion() {
      this.composition.product_type_id = this.product.Products.product_type_id;
      api.create_product_composition(this.composition).then(() => {
        this.composition = {
          product_type_id: 0,
          name: "",
          quantity: 0,
          olchov_birligi: "",
        };
        this.$util.toast().then(() => {
          this.$parent.getProduct();
        });
      });
    },
    putComposition(item) {
      api.update_product_composition(item).then(() => {
        this.$util.toast();
      });
    },
  },
};
</script>

<template>
  <div class="row gap-3 table-responsive" style="max-height: 74vh">
    <div class="col-12">
      <h5>Narx</h5>
      <form class="row" @submit.prevent="putProduct()">
        <label class="col-md-3 mb-1">
          Oxirgi narx
          <div
            class="input-group"
            :currency="$util.currency(product.Products.last_price)"
          >
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              required
              v-model="product.Products.last_price"
            />
            <div class="input-group-append">
              <select
                class="form-select"
                required
                v-model="product.Products.last_currency_id"
              >
                <option value="" hidden>valyuta</option>
                <option v-for="item in currencies" :key="item" :value="item.id">
                  {{ item.currency }}
                </option>
              </select>
            </div>
          </div>
        </label>
        <label class="col-md-3 mb-1">
          Sotuv narx
          <div
            class="input-group"
            :currency="$util.currency(product.Products.sotuv_price)"
          >
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              required
              v-model="product.Products.sotuv_price"
            />
            <div class="input-group-append">
              <select
                class="form-select"
                required
                v-model="product.Products.sotuv_currency_id"
              >
                <option value="" hidden>valyuta</option>
                <option v-for="item in currencies" :key="item" :value="item.id">
                  {{ item.currency }}
                </option>
              </select>
            </div>
          </div>
        </label>
        <label class="col-md-4 mb-1">
          Vitrina narx
          <div class="row">
            <div class="col-11">
              <div
                class="input-group"
                :currency="$util.currency(product.Products.vitrina_price)"
              >
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  step="any"
                  required
                  v-model="product.Products.vitrina_price"
                />
                <div class="input-group-append">
                  <select
                    class="form-select"
                    required
                    v-model="product.Products.vitrina_currency_id"
                  >
                    <option value="" hidden>valyuta</option>
                    <option
                      v-for="item in currencies"
                      :key="item"
                      :value="item.id"
                    >
                      {{ item.currency }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-1">
              <button class="btn btn-success">
                <img
                  src="../../assets/icons/Done_round-white.svg"
                  alt="Done_round-white"
                />
              </button>
            </div>
          </div>
        </label>
      </form>
    </div>
    <div class="col-12">
      <h5>O'lchov birlik</h5>
      <form class="row" @submit.prevent="postUnit()">
        <div class="col-md-8">
          <div class="row">
            <div class="col-12">
              <div class="input-group">
                <div class="input-group-text">1</div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="o'lchov:"
                  required
                  v-model="unit.olchov"
                />
                <div class="input-group-text">=</div>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  step="any"
                  placeholder="miqdor:"
                  required
                  v-model="unit.quantity"
                />
                <div class="input-group-text">dona</div>
                <div class="input-group-append">
                  <button class="btn btn-success">
                    <img
                      src="../../assets/icons/Add_square.svg"
                      alt="Add_square"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div class="row">
        <div class="col-md-3 my-1" v-for="item in units" :key="item">
          <div class="card">
            <div class="card-body">
              <div class="row gap-1">
                <div class="col-12">
                  1 {{ item.olchov }} = {{ item.quantity }} dona
                </div>
                <div class="col-12">
                  <button
                    class="btn btn-danger float-end"
                    @click="deleteUnit(item)"
                  >
                    <img src="../../assets/icons/del_alt.svg" alt="del_alt" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12">
      <h5>Qism</h5>
      <form class="row" @submit.prevent="postCompostion()">
        <div class="col-md-8">
          <div class="row">
            <label class="col-md-6 mb-1">
              Qism nomi
              <input
                type="text"
                class="form-control"
                required
                v-model="composition.name"
              />
            </label>
            <label class="col-md-6 mb-1">
              Qism hajmi
              <div class="row">
                <div class="col-10">
                  <div class="input-group">
                    <input
                      type="number"
                      class="form-control"
                      min="0"
                      step="any"
                      required
                      v-model="composition.quantity"
                    />
                    <select
                      class="form-select"
                      required
                      v-model="composition.olchov_birligi"
                    >
                      <option value="" hidden>o'lchov birlik</option>
                      <option
                        v-for="item in $util.units"
                        :key="item"
                        :value="item"
                      >
                        {{ item }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-2">
                  <button class="btn btn-success">
                    <img
                      src="../../assets/icons/Add_square.svg"
                      alt="Add_square"
                    />
                  </button>
                </div>
              </div>
            </label>
          </div>
        </div>
      </form>
      <div class="row">
        <div
          class="col-md-4 my-1"
          v-for="item in product.Products.product_type.product_composition"
          :key="item"
        >
          <div class="card">
            <div class="card-body">
              <form class="row gap-1" @submit.prevent="putComposition(item)">
                <div class="col-12">
                  <input
                    type="text"
                    class="form-control"
                    required
                    v-model="item.name"
                  />
                </div>
                <div class="col-12">
                  <div class="input-group">
                    <input
                      type="number"
                      class="form-control"
                      min="0"
                      step="any"
                      required
                      v-model="item.quantity"
                    />
                    <div class="input-group-append">
                      <select
                        class="form-select"
                        required
                        v-model="item.olchov_birligi"
                      >
                        <option value="" hidden>o'lchov birlik</option>
                        <option
                          v-for="item in $util.units"
                          :key="item"
                          :value="item"
                        >
                          {{ item }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <button class="btn btn-warning float-end">
                    <img src="../../assets/icons/Edit.svg" alt="Edit" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
button {
  height: auto;
}
</style>

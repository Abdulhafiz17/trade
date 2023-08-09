<script>
import DataDropdownSupply from "../../components/DataDropdown/DataDropdownSupply.vue";
import api from "../../server/api";
export default {
  name: "SupplyModal",
  emits: {
    end: null,
  },
  data() {
    return {
      category: null,
      product_type: null,
      currency: null,
      market: null,
      supply: {
        code: null,
        category_name: "",
        product_type_name: "",
        product_type_name2: "",
        quantity: null,
        olchov_birligi: "",
        price: null,
        currency_id: null,
        market_id: null,
        party_id: null,
      },
    };
  },
  computed: {
    disabled() {
      return (!this.category || !this.currency || !this.market);
    },
  },
  methods: {
    openModal() {
      this.$refs.addSupplyModal.openModal();
    },
    post() {
      // this.supply.category_name = this.category.name;
      // this.supply.product_type_name = this.product_type.name;
      // this.supply.product_type_name2 = this.product_type.name2;
      this.supply.currency_id = this.currency.id;
      this.supply.market_id = this.market.id;
      this.supply.party_id = this.$route.query.party_id;
      api.take_supply(this.supply).then(() => {
        this.addCategory(this.supply.category_name)
        this.category = null;
        this.product_type = null;
        this.currency = null;
        this.market = null;
        this.supply = {
          code: null,
          category_name: "",
          product_type_name: "",
          product_type_name2: "",
          quantity: null,
          olchov_birligi: "",
          price: null,
          currency_id: null,
          market_id: null,
          party_id: null,
        };
        this.$util.toast().then(() => {
          this.$emit("end");
          this.$refs.addSupplyModal.closeModal();
        });
      });
    },
    addCategory(prom) {
      api.create_category({ name: prom }).then((res) => {
      });
    },
    // addCurrency() {
    //   const prom = prompt("Kategoriya nomini kiriting:")
    //   api.create_category({ name: prom }).then((res) => {
    //     location.reload()
    //     this.$refs.addSupplyModal.openModal();
    //   })
    // },
  },
  components: { DataDropdownSupply }
};
</script>

<template>
  <Modal ref="addSupplyModal">
    <template #header>
      <h5>Mahsulot qo'shish</h5>
    </template>
    <template #body>
      <form class="row gap-2" id="add-supply-form" @submit.prevent="post()">
        <label class="col-12">
          Kodi
          <input type="number" class="form-control" min="0" required v-model="supply.code" />
        </label>
        <div class="col-12 category">
          Kategoriya
          <input class="form-control" type="text" v-model="supply.category_name">

        </div>
        <div class="col-12">
          Mahsulot turi
          <!-- <DataDropdown v-model="product_type" type="product_type" property="name" property2="name2"></DataDropdown> -->
          <div class="d-flex align-items-center">
            <input class="form-control me-2" type="text" v-model="supply.product_type_name" placeholder='M: IPONE'>
            <input class="form-control " type="text" v-model="supply.product_type_name2" placeholder="Marka: 14 PRO MAX">
          </div>
        </div>
        <label class="col-12">
          Miqdor
          <div class="input-group">
            <input type="number" class="form-control" min="0" step="any" required v-model="supply.quantity" />
            <div class="input-group-append">
              <select class="form-select" required v-model="supply.olchov_birligi">
                <option value="" hidden>o'lchov birligi</option>
                <option v-for="item in $util.units" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </div>
          </div>
        </label>
        <label class="col-12">
          Narx
          <div class="d-flex align-items-center" :currency="$util.currency(supply.price)">
            <input type="number" class="form-control price-input" min="0" step="any" required v-model="supply.price" />
            <div class="input-group-append price-dropdown mx-1">
              <DataDropdown v-model="currency" type="currency" property="currency"></DataDropdown>
            </div>
            <i class="fa-solid fa-plus border border-black p-1 rounded-2 text-white bg-success " @click="addCurrency"></i>
          </div>
        </label>
        <div class="col-12">
          Ta'minotchi
          <DataDropdown v-model="market" type="market" property="name"></DataDropdown>
        </div>
      </form>
    </template>
    <template #footer>
      <button class="btn btn-success" form="add-supply-form" :disabled="disabled">
        <img src="../../assets/icons/Done_round-white.svg" alt="Done_round-white" />
      </button>
    </template>
  </Modal>
</template>

<style>
.category {
  position: relative;
}

.category .fa-plus {
  position: absolute;
  top: 30px;
  right: 35px;
}

.price-input {
  width: 64% !important;
}

.price-dropdown {
  width: 36%;
}
</style>

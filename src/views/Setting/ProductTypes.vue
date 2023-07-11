<script>
import api from "../../server/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "ProductTypes",
  components: { Pagination },
  data() {
    return {
      search: "",
      categories: {
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
    this.getCategories();
  },
  methods: {
    getCategories() {
      const param = {
        search: this.search,
        page: this.categories.current_page,
        limit: this.categories.limit,
      };
      api.get_categories(param).then((res) => {
        this.categories = res.data;
        this.categories.data.forEach((item) => {
          item.search = "";
          item.product_types = {
            current_page: 0,
            pages: 1,
            limit: 25,
            data: [],
          };
        });
      });
    },
    get(item) {
      const param = {
        category_id: item.id,
        search: item.search,
        page: item.product_types.current_page,
        limit: item.product_types.limit,
      };
      api.get_product_types(param).then((res) => {
        item.product_types = res.data;
      });
    },
    put(item) {
      api.update_category(item).then(() => {
        this.$util.toast();
      });
    },
  },
};
</script>

<template>
  <main>
    <h5>Mahsulot turlari</h5>
    <p>
      Yangi mahsulot turi qo'shish yoki mavjud mahsulot turi ma'lumotini
      tahrirlash
    </p>
    <div class="row gap-2 table-responsive" style="max-height: 55vh">
      <div class="col-12">
        <input
          type="search"
          class="form-control"
          placeholder="qidiruv:"
          v-model="search"
          @keyup="getCategories()"
        />
      </div>
      <div class="col-12" v-for="item in categories.data" :key="item">
        <div
          class="input-group-text"
          :toggle-collapse="'product-type' + item.id"
          @click="item.open ? false : get(item)"
        >
          {{ item.name }}
        </div>
        <Collapse
          :id="'product-type' + item.id"
          class="border"
          v-model:open="item.open"
        >
          <div class="row gap-2">
            <div class="col-12">
              <input
                type="search"
                class="form-control form-control-sm"
                placeholder="qidiruv:"
                v-model="item.search"
                @keyup="get(item)"
              />
            </div>
            <div
              class="col-12"
              v-for="item1 in item.product_types.data"
              :key="item1"
            >
              <form
                class="input-group input-group-sm"
                @submit.prevent="put(item1)"
              >
                <input
                  type="text"
                  class="form-control"
                  placeholder="artikul:"
                  required
                  :disabled="current_user.role !== 'admin'"
                  v-model="item1.name"
                />
                <input
                  type="text"
                  class="form-control"
                  placeholder="marka:"
                  required
                  :disabled="current_user.role !== 'admin'"
                  v-model="item1.name2"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-sm btn-warning"
                    v-if="current_user.role == 'admin'"
                  >
                    <img src="../../assets/icons/Edit.svg" alt="" />
                  </button>
                </div>
              </form>
            </div>
            <div class="col-12">
              <Pagination v-model="item.product_types" @get="get" />
            </div>
          </div>
        </Collapse>
      </div>
      <div class="col-12">
        <Pagination v-model="categories" @get="getCategories" />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
}

.border {
  margin-top: 5px;
  padding: 0.5rem;
  background-color: whitesmoke;
  border: thin solid whitesmoke;
  border-radius: 5px;
}
</style>

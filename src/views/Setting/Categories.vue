<script>
import api from "../../server/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Categories",
  components: { Pagination },
  data() {
    return {
      category: {
        name: "",
      },
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
    this.get();
  },
  methods: {
    get() {
      const param = {
        search: this.search,
        page: this.categories.current_page,
        limit: this.categories.limit,
      };
      api.get_categories(param).then((res) => {
        this.categories = res.data;
      });
    },
    post() {
      api.create_category(this.category).then(() => {
        this.$util.toast().then(() => {
          this.get();
        });
      });
    },
    put(item) {
      api.update_category(item).then(() => {
        this.$util.toast().then(() => {
          this.get();
        });
      });
    },
  },
};
</script>

<template>
  <main>
    <h5>Kategoriyalar</h5>
    <p>
      Yangi kategoriya qo'shish yoki mavjud kategoriya ma'lumotini tahrirlash
    </p>
    <div class="row gap-2 table-responsive" style="max-height: 55vh">
      <div class="col-12" v-if="current_user.role == 'branch_admin'">
        <form class="input-group input-group-sm" @submit.prevent="post()">
          <input
            type="text"
            class="form-control"
            placeholder="nomi"
            required
            v-model="category.name"
          />
          <div class="input-group-append">
            <button class="btn btn-sm btn-primary">
              <img src="../../assets/icons/Add_ring.svg" alt="Add_ring" />
            </button>
          </div>
        </form>
      </div>
      <div class="col-12">
        <input
          type="search"
          class="form-control"
          placeholder="qidiruv:"
          v-model="search"
          @keyup="get()"
        />
      </div>
      <div class="col-12" v-for="item in categories.data" :key="item">
        <form class="input-group input-group-sm" @submit.prevent="put(item)">
          <input
            type="text"
            class="form-control"
            placeholder="nomi"
            required
            :disabled="current_user.role !== 'branch_admin'"
            v-model="item.name"
          />
          <div class="input-group-append">
            <button
              class="btn btn-sm btn-success"
              v-if="current_user.role == 'branch_admin'"
            >
              <img src="../../assets/icons/Done_round.svg" alt="Add_ring" />
            </button>
          </div>
        </form>
      </div>
      <div class="col-12">
        <Pagination v-model="categories" @get="get" />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
}
</style>

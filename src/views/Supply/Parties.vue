<script>
import api from "../../server/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Parties",
  components: { Pagination },
  data() {
    return {
      parties_false: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      parties_true: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.get(false, true);
  },
  methods: {
    get(status, created) {
      const param = {
        status: String(status),
        page: this["parties_" + status].current_page,
        limit: this["parties_" + status].limit,
      };
      api.get_parties(param).then((res) => {
        this["parties_" + status] = res.data;
        if (created) this.get(true);
      });
    },
    post() {
      api.create_party().then(() => {
        this.$util.toast().then(() => {
          this.get(false, true);
        });
      });
    },
  },
};
</script>

<template>
  <div class="row gap-2">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">TA'MINOTLAR</h2>
        </div>
        <div class="col-md-6">
          <button class="btn btn-success float-end" @click="post()">
            <img src="../../assets/icons/Add_square.svg" alt="Add_square" />
            Ta'minot qo'shish
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="row parties">
        <div class="col-md-6">
          Faol ta'minotlar
          <div class="row">
            <RouterLink
              class="col-md-4 mb-1"
              v-for="item in parties_false.data"
              :key="item"
              :to="{
                path: '/party',
                query: { party_id: item.id, status: item.status },
              }"
            >
              <div class="card">
                <div class="card-body">
                  <p>{{ item.time }}</p>
                </div>
              </div>
            </RouterLink>
            <div class="col-12">
              <Pagination v-model="parties_false" @get="get(false)" />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          Yakunlangan ta'minotlar
          <div class="row">
            <RouterLink
              class="col-md-4 mb-1"
              v-for="item in parties_true.data"
              :key="item"
              :to="{
                path: '/party',
                query: { party_id: item.id, status: item.status },
              }"
            >
              <div class="card">
                <div class="card-body">
                  <p>{{ item.time }}</p>
                </div>
              </div>
            </RouterLink>
            <div class="col-12">
              <Pagination v-model="parties_true" @get="get(true)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.parties {
  .col-md-6:first-child {
    border-right: thin solid whitesmoke;
  }
  .col-md-6:last-child {
    border-left: thin solid whitesmoke;
  }
}
</style>

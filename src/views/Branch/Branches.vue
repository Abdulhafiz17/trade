<script>
import api from "../../server/api";
export default {
  name: "Branches",
  data() {
    return {
      search: "",
      status: true,
      admin_id: 0,
      branches: [],
    };
  },
  created() {
    this.getBranches();
  },
  methods: {
    getBranches() {
      const param = {
        status: this.status,
        admin_id: this.admin_id,
      };
      api.get_branches(param).then((res) => {
        this.branches = res.data;
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
          <h2 class="title">FILIALLAR</h2>
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
      <div class="row">
        <div class="col-md-4" v-for="item in branches" :key="item">
          <div class="card">
            <div class="card-img">
              <img src="" alt="" v-if="item.file" />
              <i class="fa fa-5x fa-file-image" v-else></i>
            </div>
            <div class="card-body">
              <div class="flex">
                <p>
                  <i class="fa fa-code-branch"></i>
                  {{ item.Branches.name }}
                </p>
                <p>
                  <i class="fa fa-location-dot"></i>
                  {{ item.Branches.address }}
                </p>
                <p>
                  <i class="fa fa-phone"></i>
                  <a :href="'tel:+998' + item.Branches.phone">
                    {{ "+998" + $util.tel(item.Branches.phone) }}
                  </a>
                </p>
                <p>
                  <i class="fa fa-user"></i>
                  {{ item.Users.name }}
                </p>
                <p>
                  <i class="fa fa-calendar-alt"></i>
                  {{ item.Branches.active_date }}
                </p>
              </div>
              <pre>{{ item }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  .card-img {
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-body {
    .flex {
      display: flex;
      flex-direction: column;
      gap: 5px;
      p {
        .fa {
          color: black;
        }
      }
    }
  }
}
</style>

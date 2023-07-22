<script>
import api from "../../server/api";
export default {
  name: "SignIn",
  data() {
    return {
      data: {
        username: "",
        password: "",
      },
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.$store.dispatch("setUser", null);
  },
  methods: {
    post() {
      api.token(this.data).then((res) => {
        this.$store.dispatch("setUser", res.data);
        this.prepare();
      });
    },
    prepare() {
      this.$router.push("/");
    },
  },
};
</script>

<template>
  <main>
    <div class="sign-in-card">
      <form @submit.prevent="post()">
        <div class="row gap-2">
          <div class="col-12">
            <img src="../../assets/images/crud-logo.png" alt="crud-logo" />
          </div>
          <div class="col-12">
            <h2>XUSH KELIBSIZ</h2>
          </div>
          <div class="col-12">
            <div class="input-group">
              <div class="input-group-text">
                <img
                  class="icon"
                  src="../../assets/icons/User.svg"
                  alt="user"
                />
              </div>
              <input
                type="text"
                class="form-control"
                placeholder="LOGIN"
                autofocus
                required
                v-model="data.username"
              />
            </div>
          </div>
          <div class="col-12">
            <div class="input-group">
              <div class="input-group-text">
                <img
                  class="icon"
                  src="../../assets/icons/Lock.svg"
                  alt="lock"
                />
              </div>
              <input
                type="password"
                class="form-control"
                placeholder="PAROL"
                autofocus
                required
                v-model="data.password"
              />
            </div>
          </div>
          <div class="col-12 pt-3">
            <button>KIRISH</button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  place-content: center;
  place-items: center;
  background-image: url("../../assets/images/sign-in-backgroun.png");
  background-size: cover;
}

.sign-in-card {
  padding: 3rem;
  width: 30%;
  height: max-content;
  color: white;
  background-color: rgb(255, 255, 255, 0.2);
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  box-shadow: 16px 12px 24px 0px rgba(0, 0, 0, 0.25);
  text-align: center;
}

.sign-in-card img {
  width: 120px;
  height: 120px;
}

h2 {
  font-weight: 900;
  letter-spacing: 1px;
}

.input-group {
  width: 80%;
  margin: auto;
}

.form-control {
  font-size: small;
}

.icon {
  width: 20px !important;
  height: 20px !important;
}

button {
  padding: 0.7rem 1.4rem;
  color: white;
  background-color: var(--red);
  font-size: x-small;
  letter-spacing: 2px;
}
button:active {
  border-color: white;
}

@media (max-width: 768px) {
  .sign-in-card {
    width: 50%;
  }
}

@media (max-width: 425px) {
  .sign-in-card {
    width: 90%;
  }
}
</style>

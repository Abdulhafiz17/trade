<script>
export default {
  name: "NavMenu",
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    show_nav() {
      return this.$store.getters.show_nav;
    },
    current_user() {
      return this.$store.getters.user;
    },
    routers() {
      const role = this.current_user?.role;
      return [
        {
          icon: "Shop.svg",
          name: "Filiallar",
          path: "/branches",
          role: ["crud_admin", "admin"],
        },
        {
          icon: "pie_chart.svg",
          name: "Hisobotlar",
          path: "/statistic",
          role: ["branch_admin"],
        },
        {
          icon: "Basket.svg",
          name: "Kassa",
          path: "/order",
          role: ["branch_admin"],
        },
        {
          icon: "Group.svg",
          name: role == "crud_admin" ? "Adminlar" : "Hodimlar",
          path: "/users",
          role: ["crud_admin", "branch_admin"],
        },
        {
          icon: "User_box.svg",
          name: "Mijozlar",
          path: "/customers",
          role: ["branch_admin"],
        },
        {
          icon: "Wallet_alt.svg",
          name: "Nasiyalar",
          path: "/loans",
          role: ["branch_admin"],
        },
        {
          icon: "Refund_back.svg",
          name: "Mahsulot qaytarish",
          path: "/",
          role: ["branch_admin"],
        },
        {
          icon: "Shop.svg",
          name: "Mahsulotlar",
          path: "/products",
          role: ["branch_admin"],
        },
        {
          icon: "Widget_add.svg",
          name: "Mahsulotlar qoldig'i",
          path: "/",
          role: ["branch_admin"],
        },
        {
          icon: "Paper.svg",
          name: "Chiqim",
          path: "/expense",
          role: ["branch_admin"],
        },
        {
          icon: "Setting_alt_line.svg",
          name: "Sozlamalar",
          path: "/setting",
          role: [role],
        },
      ].filter((item) => {
        return item.role.includes(role);
      });
    },
  },
  created() {
    window.onclick = (event) => {
      if (!event.target.closest(".v-toggle-button"))
        this.$store.dispatch("toggleNav", false);
    };
  },
  methods: {
    getImageUrl(name) {
      return new URL(`../../assets/icons/${name}`, import.meta.url).href;
    },
  },
};
</script>

<template>
  <button class="v-toggle-button" @click="$store.dispatch('toggleNav', true)">
    <img src="../../assets/icons/Menu.svg" alt="Menu" />
  </button>

  <div class="v-nav-menu" :class="{ open: show_nav }">
    <RouterLink
      class="v-nav-link"
      v-for="item in routers"
      :key="item"
      :class="{ active: $route.path == item.path }"
      :to="item.path"
    >
      <img :src="getImageUrl(item.icon)" :alt="item.icon" />
      {{ item.name }}
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.v-toggle-button {
  position: absolute;
  top: 0;
  left: 50%;
  translate: -50%;
  padding: 10px 15px 10px 15px;
  background: var(--bs-blue);
  border: none;
  border-radius: 0px 0px 100px 100px;
  z-index: 1;
}

.v-nav-menu {
  position: fixed;
  top: 0;
  left: 5%;
  right: 5%;
  padding: 3rem;
  max-height: 90%;
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border: thin solid lightgray;
  border-radius: 10px;
  translate: 0 -100%;
  transition: all 0.25s;
  overflow: auto;
  z-index: 5;

  &.open {
    translate: 0;
  }

  .v-nav-link {
    padding: 40px 50px;
    display: flex;
    gap: 10px;
    place-content: center;
    place-items: center;
    flex: 1 1 30%;
    background-color: transparent;
    color: rgb(51, 102, 131);
    border: 1px solid rgba(51, 102, 131, 0.15);
    border-radius: 10px;
    font-size: small;

    &:hover {
      border: 1px solid rgba(51, 102, 131, 0.5);
    }

    &.active {
      background-color: rgb(51, 102, 131);
      color: white;

      img {
        mix-blend-mode: color-dodge;
      }
    }

    .icon {
      width: 25px;
      height: 25px;
      background-color: black;
    }
  }
}
</style>

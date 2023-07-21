<script>
export default {
  name: "Home",
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
  },
  created() {
    if (this.current_user.role == "admin") {
      this.$router.push("/branches");
    }
  },
};
</script>

<template>
  <div class="row">
    <div class="col-md-6">
      <h2 class="title">HOME</h2>
    </div>
  </div>
  <RouterLink to="/statistic">Hisobotlar</RouterLink>
</template>

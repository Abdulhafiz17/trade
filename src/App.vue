<script>
import Loading from "./components/Animation/Loading.vue";
import NavMenu from "./components/NavMenu/NavMenu.vue";
export default {
  name: "App",
  components: { Loading, NavMenu },
};
</script>

<template>
  <Loading />
  <NavMenu v-if="$route.name !== 'sign-in'" />
  <RouterView v-slot="{ Component, route }">
    <Transition name="v-route" mode="out-in">
      <main :key="route">
        <component :is="Component" />
      </main>
    </Transition>
  </RouterView>
</template>

<style scoped>
.v-route-enter-from,
.v-route-leave-to {
  opacity: 0;
}

.v-route-enter-active,
.v-route-leave-active {
  transition: opacity 0.25s;
}

main {
  width: 100%;
  height: 100%;
}
</style>

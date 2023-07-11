<script>
export default {
  name: "Loading",
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
  },
};
</script>

<template>
  <Transition name="loading">
    <div class="backdrop" v-if="loading">
      <div class="spinner-1">
        <div class="spinner-2">
          <div class="spinner-3">
            <div class="spinner-4"></div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(3px);
  z-index: 15;
}

.backdrop div {
  padding: 10px;
  border-radius: 50%;
  animation: spinner 1.5s linear infinite;
}

.spinner-1 {
  border: 5px solid transparent;
  border-block-end: 5px solid #bdd7f1;
}

.spinner-2 {
  border: 5px solid transparent;
  border-block-start: 5px solid #97c1ea;
}

.spinner-3 {
  border: 5px solid transparent;
  border-block-end: 5px solid #5c9dde;
}

.spinner-4 {
  border: 5px solid transparent;
  border-block-start: 5px solid #0066cc;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.25s;
}
</style>

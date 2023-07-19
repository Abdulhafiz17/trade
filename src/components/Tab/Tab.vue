<script>
export default {
  name: "Tab",
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  emits: {
    change: null,
  },
  data() {
    return {
      active: 0,
      timeout: null,
    };
  },
  methods: {
    setTab(tab) {
      clearTimeout(this.timeout);
      this.active = -1;
      this.timeout = setTimeout(() => {
        this.active = tab;
        this.$emit("change");
      }, 100);
    },
  },
};
</script>

<template>
  <div class="v-tab-buttons">
    <button
      v-for="(item, index) in tabs"
      :key="item"
      :class="{ active: item == tabs[active] }"
      @click="setTab(index)"
    >
      {{ item }}
    </button>
  </div>
  <Transition name="v-tab" mode="out-in">
    <div class="v-tab-content" v-if="active + 1">
      <slot :name="active + 1"></slot>
    </div>
  </Transition>
</template>

<style scoped>
.v-tab-buttons {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  border-radius: 10px;
}

button {
  flex: 1 1 auto;
  background: whitesmoke;
  border-color: transparent;
  font-size: small;
  font-weight: 400;
  transition: all 0.25s;
}

button:hover {
  background-color: lightgray;
}

button:active {
  border-color: transparent;
}

button.active {
  color: white;
  background-color: var(--bs-blue);
}

.v-tab-content {
  margin-top: 5px;
  padding: 1rem;
  width: 100%;
  border: thin solid whitesmoke;
  border-radius: 10px;
}

.v-tab-enter-active {
  animation: toggleTab 0.25s;
}
.v-tab-leave-active {
  animation: toggleTab 0.25s reverse;
}

@keyframes toggleTab {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

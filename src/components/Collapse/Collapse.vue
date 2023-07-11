<script>
export default {
  name: "Collapse",
  props: {
    id: { type: String, required: true },
    open: null,
  },
  emits: ["update:open"],
  data() {
    return {
      active: false,
    };
  },
  watch: {
    active(val) {
      this.$emit("update:open", val);
    },
  },
  computed: {
    buttons() {
      return document.querySelectorAll(`[toggle-collapse="${this.$props.id}"]`);
    },
  },
  mounted() {
    this.buttons.forEach((button) => {
      button.onclick = () => {
        this.active = !this.active;
      };
    });
  },
};
</script>

<template>
  <transition name="v-collapse">
    <div class="v-collapse-body" v-if="active">
      <slot />
    </div>
  </transition>
</template>

<style>
:root {
  --blue: rgb(13, 110, 253);
  --indigo: rgb(102, 16, 242);
  --purple: rgb(111, 66, 193);
  --pink: rgb(214, 51, 132);
  --red: rgb(220, 53, 69);
  --orange: rgb(253, 126, 20);
  --yellow: rgb(255, 193, 7);
  --green: rgb(25, 135, 84);
  --teal: rgb(32, 201, 151);
  --cyan: rgb(13, 202, 240);
}

.v-collapse-enter-active,
.v-collapse-leave-active {
  transition: all 0.2s;
}

.v-collapse-enter-active {
  animation: toggleCollapse 0.2s ease;
}

.v-collapse-leave-active {
  animation: toggleCollapse 0.2s ease reverse;
}

@keyframes toggleCollapse {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

[toggle-collapse] {
  position: relative;
  padding-right: 1.5rem !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
  cursor: pointer;
}

[toggle-collapse]::after {
  content: "▾";
  position: absolute;
  right: 1%;
  color: gray;
}

.v-collapse-body {
  width: 100%;
  background-color: transparent;
  border-radius: 10px;
}
</style>

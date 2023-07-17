<script>
export default {
  name: "Dropdown",
  props: {
    id: {
      required: true,
    },
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    dropdown() {
      return document.querySelector(`#${this.$props.id}`, `.v-dropdown`);
    },
    button() {
      return this.dropdown.querySelector(`[toggle]`);
    },
  },
  mounted() {
    this.button.onclick = () => {
      this.open = !this.open;
    };
    window.onclick = (event) => {
      if (event.target !== this.button) this.open = false;
    };
  },
};
</script>

<template>
  <div class="v-dropdown" :id="id">
    <slot></slot>
    <Transition name="v-toggle-dropdown">
      <div class="v-dropdown-menu" v-if="open">
        <slot name="menu"></slot>
      </div>
    </Transition>
  </div>
</template>

<style>
.v-dropdown {
  position: relative;
}

.v-dropdown-menu {
  position: absolute;
  padding: 1px;
  width: 100%;
  min-width: 100px;
  background-color: white;
  border: thin solid rgb(100, 108, 255);
  border-radius: 10px;
  translate: 0 5px;
  z-index: 2;
}

.v-toggle-dropdown-enter-active {
  animation: toggleDropdown 0.15s;
}

.v-toggle-dropdown-leave-active {
  animation: toggleDropdown 0.15s reverse;
}

@keyframes toggleDropdown {
  from {
    opacity: 0;
    translate: 0 -5px;
  }
  to {
    opacity: 1;
    transform: 0 5px;
  }
}
.v-dropdown [toggle] {
  position: relative;
  padding-right: 1.5rem !important;
}

.v-dropdown [toggle]::after {
  content: "▾";
  position: absolute;
  right: 1%;
  color: gray;
}
</style>

<script>
export default {
  name: "Modal",
  props: {
    size: String,
  },
  emits: ["open", "close"],
  data() {
    return {
      open: false,
      timeout: null,
    };
  },
  computed: {
    modal_size() {
      return String(this.$props.size || "md").toLocaleLowerCase();
    },
  },
  methods: {
    toggleModal() {
      if (this.open) this.closeModal();
      else this.openModal();
    },
    openModal() {
      this.open = true;
      this.$emit("open");
    },
    closeModal() {
      this.open = false;
      this.$emit("close");
    },
  },
};
</script>

<template>
  <Transition name="v-toggle-modal">
    <div class="v-backdrop" v-if="open">
      <div class="v-modal" :class="modal_size">
        <button class="v-close" @click="closeModal()">&#10006;</button>
        <div class="v-modal-header">
          <slot name="header"></slot>
        </div>
        <div class="v-modal-body">
          <slot name="body"></slot>
        </div>
        <div class="v-modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.v-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 2rem 0;
  display: flex;
  place-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1px);
  overflow: auto;
  z-index: 10;
}

.v-modal {
  position: relative;
  height: max-content;
  background-color: white;
  border-radius: 10px;
  transition: all 0.3s;
}

.v-modal.sm {
  width: 320px;
}

.v-modal.md {
  width: 425px;
}

.v-modal.lg {
  width: 768px;
}

.v-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0;
  color: black;
  border-color: transparent;
  background-color: transparent;
  font-size: large;
}

.v-modal-header {
  padding: 1rem 1rem 0 1rem;
}

.v-modal-body {
  padding: 1rem 1rem 1rem 1rem;
}

.v-modal-footer {
  padding: 0 1rem 1rem 1rem;
  text-align: end;
}

.v-toggle-modal-enter-active {
  animation: toggleBackdrop 0.3s;
}
.v-toggle-modal-leave-active {
  animation: toggleBackdrop 0.3s reverse;
}

.v-toggle-modal-enter-active .v-modal {
  animation: toggleModal 0.3s;
}
.v-toggle-modal-leave-active .v-modal {
  animation: toggleModal 0.3s reverse;
}

@keyframes toggleBackdrop {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes toggleModal {
  from {
    opacity: 0;
    translate: 0 -30px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@media (max-width: 320px) {
  .v-modal.sm,
  .v-modal.md,
  .v-modal.lg {
    width: 90%;
  }
}

@media (max-width: 425px) {
  .v-modal.md,
  .v-modal.lg {
    width: 90%;
  }
}

@media (max-width: 768px) {
  .v-modal.lg {
    width: 90%;
  }
}
</style>

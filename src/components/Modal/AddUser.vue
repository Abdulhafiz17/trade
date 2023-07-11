<script>
export default {
  name: "AddUser",
  methods: {
    open() {
      this.$refs.addUserModal.openModal();
    },
  },
};
</script>

<template>
  <Modal ref="addUserModal">
    <template #body> add user modal </template>
  </Modal>
</template>

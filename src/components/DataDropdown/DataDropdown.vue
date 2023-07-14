<script>
import api from "../../server/api";
export default {
  name: "DataDropdown",
  props: {
    modelValue: null,
    type: String,
    property: String,
    all: Boolean,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      id: Date.now(),
      list: [],
    };
  },
  created() {
    this.get();
  },
  methods: {
    get() {},
  },
};
</script>

<template>
  <dropdown :id="type + id">
    <button toggle>{{ modelValue[property] || $util.captalize(type) }}</button>
    <template #menu>
      <ul class="list">
        <li v-if="all" @click="$emit('update:modelValue', null)">Hammasi</li>
        <li
          v-for="item in list"
          :key="item"
          @click="$emit('update:modelValue', item)"
        >
          {{ item[property] }}
        </li>
      </ul>
    </template>
  </dropdown>
</template>

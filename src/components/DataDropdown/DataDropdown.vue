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
      search: "",
      list: [],
      current_page: 0,
      pages: 1,
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
    request() {
      const type = this.$props.type;
      switch (type) {
        case "user":
          return "get_users";
        case "customer":
          return "get_customers";
        default:
          break;
      }
    },
    searchable() {
      if (this.$props.type == "customer") return true;
    },
  },
  mounted() {
    this.list = [];
    this.get(0);
  },
  methods: {
    get(page) {
      const param = {
        branch_id: this.current_user.branch_id,
        search: this.search,
        page: page,
        limit: 20,
      };
      api[this.request](param).then((res) => {
        this.list = this.list.concat(res.data.data);
        this.current_page = res.data.current_page;
        this.pages = res.data.pages;
      });
    },
    scroll(event) {
      const element = event.target;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        if (this.current_page < this.pages - 1) {
          this.get(this.current_page + 1);
        }
      }
    },
  },
};
</script>

<template>
  <dropdown :id="type + id">
    <button type="button" toggle>
      {{ modelValue?.[property] || $util.captalize(type) }}
    </button>
    <template #menu>
      <div class="table-responsive" @scroll="scroll($event)">
        <input
          type="search"
          class="form-control form-control-sm mb-1"
          placeholder="qidiruv:"
          v-model="search"
          @keyup="
            list = [];
            get(0);
          "
          v-if="searchable"
        />
        <ul class="list">
          <li v-if="all" @click="$emit('update:modelValue', null)">Hammasi</li>
          <li
            v-for="item in list"
            :key="item"
            @click="$emit('update:modelValue', item)"
          >
            {{ item?.[property] }}
          </li>
        </ul>
      </div>
    </template>
  </dropdown>
</template>

<style scoped>
button {
  width: 100%;
}

.table-responsive {
  padding: 5px 0;
  max-height: 20vh;
  scrollbar-gutter: stable both-edges;
}

input {
  border-radius: 10px;
}

ul {
  margin: 0;
  padding: 0;
  width: 100%;
  border: thin solid transparent;
  border-radius: 10px;
  list-style: none;
}

ul.list {
  border-color: lightgray;
}

li {
  padding: 5px;
}

li:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

li:last-child {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

ul.list li {
  border-bottom: thin solid lightgray;
  cursor: pointer;
}

ul.list li:hover {
  background-color: whitesmoke;
}

ul.list li:last-child {
  border: none;
}
</style>

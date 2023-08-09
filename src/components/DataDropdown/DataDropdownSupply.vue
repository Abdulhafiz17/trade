<script>
import api from "../../server/api";
export default {
  name: "DataDropdowSupply",
  props: {
    modelValue: null,
    data: Array,
    type: String,
    property: String,
    property2: String,
    all: Boolean,
    params: Object,
  },
  emits: ["update:modelValue", "change"],
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
        case "market":
          return "get_markets";
        case "currency":
          return "get_currencies";
        case "category":
          return "get_categories";
        case "product_type":
          return "get_product_types";
        default:
          break;
      }
    },
    param() {
      const param = this.$props.params;
      const category_id = param?.category_id || 0;
      return {
        branch_id: this.current_user.branch_id,
        category_id: category_id,
        search: this.search,
        page: this.current_page,
        limit: 20,
      };
    },
    searchable() {
      if (["customer", "product_type"].includes(this.$props.type)) return true;
      else return false;
    },
    title() {
      const type = this.$props.type;
      switch (type) {
        case "user":
          return "Hodim";
        case "customer":
          return "Mijoz";
        case "market":
          return "Ta'minotchi";
        case "currency":
          return "Valyuta";
        case "category":
          return "Kategoriya";
        case "product_type":
          return "Mahsulot turi";
        default:
          break;
      }
    },
  },
  created() {
    this.list = [];
    if (!this.data) this.get();
  },
  methods: {
    get() {
      api[this.request](this.param).then((res) => {
        if (this.$props.type == "currency")
          this.list = this.list.concat(res.data);
        else this.list = this.list.concat(res.data.data);
        this.current_page = res.data.current_page;
        this.pages = res.data.pages;
      });
    },
    scroll(event) {
      const element = event.target;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        if (this.current_page < this.pages - 1) {
          this.current_page = this.current_page + 1;
          this.get();
        }
      }
    },
    update(value) {
      this.$emit("update:modelValue", value);
      this.$emit("change");
    },
  },
};
</script>

<template>
  <dropdown :id="type + id">
    <button type="button" class="btn" toggle>
      {{
        modelValue
        ? modelValue?.[property] +
        (property2 ? " - " + modelValue?.[property2] : "")
        : title
      }}
    </button>
    <template #menu>
      <div class="table-responsive" @scroll="scroll($event)">
        <datalist type="search" class="form-control form-control-sm mb-1" placeholder="qidiruv:" :value="search" @keyup="
          list = [];
        current_page = 0;
        get();
        " v-if="searchable">
          <option v-for="item in data || list" :key="item" @click="update(item)">
            {{ item?.[property] }}
            {{ property2 ? " - " + item?.[property2] : "" }}
          </option>
        </datalist>

      </div>
    </template>
  </dropdown>
</template>

<style scoped>
button {
  width: 100%;
  background-color: whitesmoke;
}

.table-responsive {
  padding: 5px 0;
  max-height: 25vh;
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

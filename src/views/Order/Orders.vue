<script>
import api from "../../server/api";
export default {
  name: "Orders",
  props: {
    order: null,
    orders: {
      current_page: 0,
      pages: 1,
      limit: 25,
      data: [],
    },
  },
  emit: ["update:order"],
  methods: {
    addOrder() {
      api.create_order().then(() => {
        this.$util.toast().then(() => {
          this.$parent.getOrders();
        });
      });
    },
    removeOrder(id) {
      api.remove_order({ order_id: id }).then(() => {
        this.$util.toast().then(() => {
          this.$parent.getOrders();
        });
      });
    },
  },
};
</script>

<template>
  <main>
    <strong>Buyurtmalar</strong>
    <div class="orders">
      <button class="add-order" @click="addOrder()">
        <img
          src="../../assets/icons/Add_square_green.svg"
          alt="Add_square_green"
        />
      </button>
      <div class="btn-group" v-for="item in orders.data" :key="item">
        <button
          class="order"
          :class="{ active: item.Orders.id == order.Orders.id }"
          @click="$emit('update:order', item)"
        >
          №{{ item.Orders.ordinal_number }}
        </button>
        <button class="delete" @click="removeOrder(item.Orders.id)">
          <img src="../../assets/icons/del_alt.svg" alt="del_alt" />
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  justify-content: end;
  align-items: center;

  strong {
    margin: 0 1rem;
  }

  .orders {
    padding: 0.5rem;
    display: flex;
    gap: 1rem;
    background-color: whitesmoke;
    border-radius: 10px;
    overflow: auto;

    .add-order {
      padding: 0;
      background-color: transparent;
      border-color: transparent;

      img {
        width: 30px;
      }
    }

    .btn-group {
      border-radius: 10px;

      .order {
        padding: 5px;
        background-color: transparent;
        border: thin solid lightgray;
        border-top-left-radius: inherit;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: inherit;
        font-weight: 700;

        &.active {
          background-color: white;
        }
      }

      .delete {
        padding: 5px;
        background-color: var(--red);
        border-top-left-radius: 0;
        border-top-right-radius: inherit;
        border-bottom-right-radius: inherit;
        border-bottom-left-radius: 0;

        img {
          width: 20px;
        }
      }
    }
  }
}
</style>

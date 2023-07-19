<script>
import api from "../../server/api";
export default {
  name: "PaymentModal",
  props: {
    source: null,
    type: null,
  },
  emits: {
    end: null,
  },
  data() {
    return {
      payment: {
        money: 0,
        type: "",
        comment: "",
      },
    };
  },
  computed: {
    title() {
      switch (this.$props.type) {
        case "user":
          return "Hodim";
        case "loan":
          return "Nasiya";
        default:
          return "";
      }
    },
    request() {
      switch (this.$props.type) {
        case "loan":
          return "take_loan";
        default:
          return "";
      }
    },
  },
  methods: {
    openModal() {
      this.$refs.paymentModal.openModal();
    },
    post() {
      const source = this.$props.type == "loan" ? "id" : "source";
      const data = {
        [source]: this.$props.source,
        money: this.payment.money,
        type: this.payment.type,
        comment: this.payment.comment,
      };
      api[this.request](Array(data)).then((res) => {
        this.payment = {
          money: 0,
          type: "",
          comment: "",
        };
        this.$util.toast().then(() => {
          this.$refs.paymentModal.closeModal();
          this.$emit("end");
        });
      });
    },
  },
};
</script>

<template>
  <Modal ref="paymentModal">
    <template #header>
      <h5>{{ title }}ga to'lov</h5>
    </template>
    <template #body>
      <form class="row gap-2" @submit.prevent="post()" id="payment-form">
        <label class="col-12">
          To'lov summa
          <div class="input-group" :curreny="$util.currency(payment.money)">
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              required
              v-model="payment.money"
            />
            <div class="input-group-text">so'm</div>
            <div class="input-group-append">
              <select class="form-select" required v-model="payment.type">
                <option value="" hidden>to'lov turi</option>
                <option
                  v-for="item in $util.payment_types"
                  :key="item"
                  :value="item"
                >
                  {{ item }}
                </option>
              </select>
            </div>
          </div>
        </label>
        <label class="col-12" v-if="type !== 'loan'">
          Izoh
          <textarea
            cols="30"
            rows="2"
            class="form-control"
            v-model="payment.comment"
          ></textarea>
        </label>
      </form>
    </template>
    <template #footer>
      <button class="btn btn-success" form="payment-form">
        <img
          src="../../assets/icons/Done_round-white.svg"
          alt="Done_round-white"
        />
      </button>
    </template>
  </Modal>
</template>

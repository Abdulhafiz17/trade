<script>
import api from "../../server/api";
import Fixed from "./Fixed.vue";
import Variable from "./Variable.vue";
export default {
  name: "Expense",
  components: { Fixed, Variable },
  data() {
    return {
      fixed_expenses: [],
      payment_expense: null,
      payment_type: "fixed",
      payment_currency: null,
      payment: {
        money: 0,
        currency_id: 0,
        source: 0,
        comment: "",
      },
    };
  },
  created() {
    this.getFixedExpenses();
  },
  methods: {
    getFixedExpenses() {
      api.get_fixed_expenses().then((res) => {
        this.fixed_expenses = res.data;
      });
    },
    payExpense() {
      const request =
        this.payment_type == "fixed"
          ? "pay_for_fixed_expense"
          : "pay_for_variable_expense";
      this.payment.source = this.payment_expense?.id || 0;
      this.payment.currency_id = this.payment_currency.id;
      api[request](this.payment).then(() => {
        this.payment_expense = null;
        this.payment_currency = null;
        this.payment = {
          money: 0,
          currency_id: 0,
          source: 0,
          comment: "",
        };
        this.$util.toast().then(() => {
          this.$refs.payExpenseModal.closeModal();
          this.getHistory();
        });
      });
    },
    getHistory() {
      if (this.payment_type == "fixed") {
        this.$refs.expenseTab.setTab(0);
      } else {
        this.$refs.expenseTab.setTab(1);
      }
    },
  },
};
</script>

<template>
  <div class="row gap-3">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">CHIQIM</h2>
        </div>
        <div class="col-md-6"></div>
      </div>
    </div>
    <div class="col-12">
      <Tab :tabs="[`Doimiy`, `Bir marttalik`]" ref="expenseTab">
        <template #1>
          <Fixed
            :fixed_expenses="fixed_expenses"
            @add-expense="getFixedExpenses()"
          />
        </template>
        <template #2> <Variable /> </template>
      </Tab>
    </div>
  </div>
  <button
    class="btn-group btn-group-sm modal-button"
    @click="$refs.payExpenseModal.openModal()"
  >
    <span class="btn text-light bg-success">Qo'shish</span>
    <span class="btn text-light bg-primary">
      <img src="../../assets/icons/Add_ring-white.svg" alt="Add_ring-white" />
    </span>
  </button>

  <Modal ref="payExpenseModal">
    <template #header>
      <h5>Chiqim qilish</h5>
    </template>
    <template #body>
      <form class="row gap-2" @submit.prevent="payExpense()" id="payment-form">
        <div class="col-12">
          <div class="row">
            <div class="col-md-6">
              <button
                type="button"
                class="w-100"
                :class="{ 'text-white bg-primary': payment_type == 'fixed' }"
                @click="payment_type = 'fixed'"
              >
                Doimiy
              </button>
            </div>
            <div class="col-md-6">
              <button
                type="button"
                class="w-100"
                :class="{ 'text-white bg-primary': payment_type == 'variable' }"
                @click="payment_type = 'variable'"
              >
                Bir marttalik
              </button>
            </div>
          </div>
        </div>
        <div class="col-12" v-if="payment_type == 'fixed'">
          <DataDropdown
            :data="fixed_expenses"
            type="expense"
            property="name"
            v-model="payment_expense"
          ></DataDropdown>
        </div>
        <label class="col-12">
          Summa
          <div class="input-group" :currency="$util.currency(payment.money)">
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              required
              v-model="payment.money"
            />
            <div class="input-group-append">
              <DataDropdown
                type="currency"
                property="currency"
                v-model="payment_currency"
              ></DataDropdown>
            </div>
          </div>
        </label>
        <label class="col-12">
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
      <button
        class="btn btn-success"
        form="payment-form"
        :disabled="
          payment_type == 'fixed'
            ? !payment_expense || !payment_currency
            : !payment_currency
        "
      >
        <img
          src="../../assets/icons/Done_round-white.svg"
          alt="Done_round-white"
        />
      </button>
    </template>
  </Modal>
</template>

<style scoped>
.modal-button {
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  padding: 0;
}

.modal-button .bg-primary {
  padding: 2px 5px;
  height: 100%;
}
</style>

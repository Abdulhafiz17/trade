<script>
import api from "../../server/api";
import Supplies from "./Supplies.vue";
import Expenses from "./Expenses.vue";
export default {
  name: "Party",
  components: { Supplies, Expenses },
  data() {
    return {
      status: this.$route.query.status,
      currency: null,
      party: {
        party_id: this.$route.query.party_id,
        currency_id: null,
        to_price: true,
      },
    };
  },
  methods: {
    put() {
      this.party.currency_id = this.currency.id;
      api.party_acceptance(this.party).then(() => {
        this.$util.toast().then(() => {
          this.$router.push({ path: "/parties" });
        });
      });
    },
  },
};
</script>

<template>
  <div class="row gap-3">
    <div class="col-12">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">TA'MINOT</h2>
        </div>
        <div class="col-md-6">
          <button
            class="btn btn-success float-end"
            @click="$refs.acceptancePartyModal.openModal()"
            v-if="status == 'false'"
          >
            <img
              src="../../assets/icons/Done_all_round.svg"
              alt="Done_all_round"
            />
            Ta'minotni yakunlash
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <Tab :tabs="[`Mahsulotlar`, `Chiqimlar`]">
        <template #1>
          <Supplies />
        </template>
        <template #2>
          <Expenses />
        </template>
      </Tab>
    </div>
  </div>

  <Modal ref="acceptancePartyModal">
    <template #header>
      <h5>Ta'minotni yakunlash</h5>
    </template>
    <template #body>
      <form
        class="row gap-3"
        id="acceptance-party-form"
        @submit.prevent="put()"
      >
        <div class="col-12">
          Valyuta
          <p>Ta'minot uchun bo'lgan chiqimlarni yaxlitlash valyutasi</p>
          <DataDropdown
            v-model="currency"
            type="currency"
            property="currency"
          ></DataDropdown>
        </div>
        <div class="col-12">
          Tan narxni hisoblash
          <p>
            Har bir mahsulot narxiga ko'ra yoki mahsulotlar miqdoriga ko'ra tan
            narx belgilash
          </p>
          <div class="row">
            <div class="col-6">
              <button
                type="button"
                class="btn btn-light w-100"
                :class="{ 'bg-primary text-light': party.to_price }"
                @click="party.to_price = true"
              >
                Narx bo'yicha
              </button>
            </div>
            <div class="col-6">
              <button
                type="button"
                class="btn btn-light w-100"
                :class="{ 'bg-primary text-light': !party.to_price }"
                @click="party.to_price = false"
              >
                Miqdor bo'yicha
              </button>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button
        class="btn btn-success"
        form="acceptance-party-form"
        :disabled="!currency"
      >
        <img
          src="../../assets/icons/Done_round-white.svg"
          alt="Done_round-white"
        /></button
    ></template>
  </Modal>
</template>

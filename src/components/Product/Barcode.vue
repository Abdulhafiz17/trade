<script>
import api from "../../server/api";
import JsBarcode from "jsbarcode";
export default {
  name: "Barcode",
  data() {
    return {
      code: null,
      product: null,
      branch: null,
      logo: "",
    };
  },
  computed: {
    current_user() {
      return this.$store.getters.user;
    },
    style() {
      return `
* {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.barcode {
  width: 6cm;
  height: 4cm;
  text-align: center;
}

.barcode-header {
  display: flex;
  height: 1.5cm;
}

.header-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5cm;
  height: 1.5cm;
}

.header-image img {
  width: 90%;
  height: 90%;
  object-fit: contain;
}

.header-data {
  width: 4.5cm;
  font-size: small;
  line-height: 1rem;
}

.barcode-body {
  display: flex;
  align-items: center;
  height: 1cm;
  font-weight: 500;
}

.barcode-body span {
  flex: 1;
}

.barcode-body div {
  flex: 2;
  font-size: large;
  font-weight: 700;
}

.barcode-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.5cm;
}`;
    },
  },
  created() {
    this.getBranch();
  },
  methods: {
    start(code) {
      this.code = code;
      this.getProduct();
    },
    getProduct() {
      api.get_product({ code: this.code }).then((res) => {
        this.product = res.data;
        this.$refs.barcodeModal.openModal();
      });
    },
    getBranch() {
      api.get_branch({ branch_id: this.current_user.branch_id }).then((res) => {
        this.branch = res.data.Branches;
        this.logo = res.data.file;
      });
    },
    createBarcode() {
      this.$nextTick(() => {
        JsBarcode("#barcode", this.code, {
          width: 2,
          height: 25,
          margin: 0,
          //   displayValue: false,
        });
      });
    },
    printTag() {
      const tag = document.querySelector("#tag").outerHTML;
      const winPrint = window.open("", "_blank");
      winPrint.document.querySelector(
        "head"
      ).innerHTML += `<style>${this.style}</style>`;
      winPrint.document.body.innerHTML = tag;
      setTimeout(() => {
        winPrint.print();
        winPrint.close();
      }, 100);
    },
  },
};
</script>

<template>
  <Modal ref="barcodeModal" @open="createBarcode()">
    <template #body>
      <div class="d-flex justify-content-center">
        <div id="tag" class="barcode">
          <div class="barcode-header">
            <div class="header-image">
              <img :src="$baseurl + '/uploaded_files/' + logo" alt="logo" />
            </div>
            <div class="header-data">
              <b>{{ branch?.name }}</b>
              <p>{{ product?.Products?.category?.name }}</p>
              <span>
                {{ product?.Products?.product_type?.name }}
                {{ product?.Products?.product_type?.name2 }}
              </span>
            </div>
          </div>
          <div class="barcode-body">
            <span>narx</span>
            <div>{{ $util.currency(product?.Products?.vitrina_price) }}</div>
            <span>{{ product?.vitrina_currency?.currency }}</span>
          </div>
          <div class="barcode-footer">
            <img id="barcode" />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-primary" @click="printTag()">
        <i class="fa fa-print"></i>
      </button>
    </template>
  </Modal>
</template>

<style scoped>
img {
  width: auto;
}

.barcode {
  width: 6cm;
  height: 4cm;
  text-align: center;
  border: thin solid whitesmoke;
}

.barcode-header {
  display: flex;
  height: 1.5cm;
}

.header-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5cm;
  height: 1.5cm;
}

.header-image img {
  width: 90%;
  height: 90%;
  object-fit: contain;
}

.header-data {
  width: 4.5cm;
  font-size: small;
  line-height: 1rem;
}

.barcode-body {
  display: flex;
  align-items: center;
  height: 1cm;
  font-weight: 500;
}

.barcode-body span {
  flex: 1;
}

.barcode-body div {
  flex: 2;
  font-size: large;
  font-weight: 700;
}

.barcode-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.5cm;
}
</style>

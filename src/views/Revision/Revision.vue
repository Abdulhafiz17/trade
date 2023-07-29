<script>
import api from "../../server/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Revision",
  components: { Pagination },
  data() {
    return {
      tab: 0,
      controls: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      products_waiting: {
        code: null,
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      products_counted: {
        code: null,
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      products_not_equal: {
        code: null,
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.getProductsWaiting();
    this.getProductsCounted();
  },
  methods: {
    changeTab(tab) {
      if (tab == 0) {
        this.products_waiting = {
          code: null,
          current_page: 0,
          pages: 1,
          limit: 25,
          data: [],
        };
        this.products_counted = {
          code: null,
          current_page: 0,
          pages: 1,
          limit: 25,
          data: [],
        };
        this.getProductsWaiting();
        this.getProductsCounted();
      } else {
        this.products_not_equal = {
          code: null,
          current_page: 0,
          pages: 1,
          limit: 25,
          data: [],
        };
        this.getProductsNotEqual();
      }
    },
    openControl() {
      api.create_control().then((Response) => {
        this.$util.toast().then(() => {
          this.getProductsWaiting();
          this.getProductsCounted();
        });
      });
    },
    cancelControl() {
      api.remove_control().then((Response) => {
        this.$util.toast().then(() => {
          this.getProductsWaiting();
          this.getProductsCounted();
        });
      });
    },
    submitControl() {
      api.change_product_quantity().then((Response) => {
        this.$util.toast().then(() => {
          this.$refs.revisionTab.setTab(0);
        });
      });
    },
    getControls() {
      const param = {
        status: "true",
        page: this.controls.current_page,
        limit: this.controls.limit,
      };
      api.get_controls(param).then((Response) => {
        this.controls = Response.data;
      });
    },
    getProductsWaiting() {
      const param = {
        control_id: 0,
        status: "not_counted",
        code: this.products_waiting.code || 0,
        page: this.products_waiting.current_page,
        limit: this.products_waiting.limit,
      };
      api.get_products_control(param).then((Response) => {
        this.products_waiting.data = Response.data.data;
      });
    },
    getProductsCounted() {
      const param = {
        control_id: 0,
        status: "counted",
        code: this.products_counted.code || 0,
        page: this.products_counted.current_page,
        limit: this.products_counted.limit,
      };
      api.get_products_control(param).then((Response) => {
        this.products_counted.data = Response.data.data;
        if (this.products_counted.data.length) {
          this.products_counted.data.forEach((product) => {
            product.edit = false;
          });
        }
      });
    },
    getProductsNotEqual() {
      const param = {
        control_id: 0,
        status: "not_equal",
        code: this.products_not_equal.code || 0,
        page: this.products_not_equal.current_page,
        limit: this.products_not_equal.limit,
      };
      api.get_products_control(param).then((Response) => {
        this.products_not_equal.data = Response.data.data;
        if (this.products_not_equal.data.length) {
          this.products_not_equal.data.forEach((product) => {
            product.edit = false;
          });
        }
      });
    },
    putProduct(product) {
      api.update_product_control(product).then((Response) => {
        this.$util.toast().then(() => {
          if (this.tab == 0) {
            this.getProductsWaiting();
            this.getProductsCounted();
          } else if (this.tab == 1) {
            this.getProductsNotEqual();
          }
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
          <h2 class="title">MAHSULOTLAR QOLDIG'I</h2>
        </div>
        <div class="col-md-6">
          <button
            class="btn btn-sm btn-secondary float-end"
            @click="
              getControls();
              $refs.revisionsModal.openModal();
            "
          >
            Tekshiruvlar tarixi
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="d-flex gap-1">
        <button
          class="btn btn-primary"
          @click="openControl()"
          v-if="!products_waiting.data.length && !products_counted.data.length"
        >
          Tekshiruv qo'shish
        </button>
        <button
          class="btn btn-danger"
          @click="cancelControl()"
          v-if="products_waiting.data.length && !products_counted.data.length"
        >
          Tekshiruvni yakunlash
        </button>
        <button
          class="btn btn-success"
          @click="submitControl()"
          v-if="
            products_waiting.data.length
              ? false
              : products_counted.data.length
              ? true
              : false
          "
        >
          Tekshiruvni tasdiqlash
        </button>
      </div>
    </div>
    <div class="col-12">
      <Tab
        :tabs="[`Jarayon`, `Tasdiqlash`]"
        @change="changeTab($event)"
        ref="revisionTab"
      >
        <template #1>
          <div class="row">
            <div class="col-md-6">
              <h5>Sanalmagan</h5>
              <div class="input-group input-group-sm">
                <input
                  type="search"
                  class="form-control"
                  placeholder="Qidiruv"
                  v-model="products_waiting.code"
                  @input="
                    products_waiting.current_page = 0;
                    products_waiting.limit = 25;
                    getProductsWaiting();
                  "
                />
                <div class="input-group-text">
                  <i class="fa fa-barcode" />
                </div>
              </div>
              <div class="responsive-y" style="max-height: 60vh">
                <table class="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Mahsulot - Artikul - Marka - Code</th>
                      <th>Hajm</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in products_waiting.data" :key="item">
                      <td>
                        {{
                          item.category +
                          " - " +
                          item.product_type_name +
                          " - " +
                          item.product_type_name +
                          " - " +
                          item.code
                        }}
                      </td>
                      <td>
                        <form @submit.prevent="putProduct(item)">
                          <div class="input-group input-group-sm">
                            <input
                              class="form-control"
                              type="number"
                              step="any"
                              min="0"
                              placeholder="miqdor"
                              required
                              v-model="item.real_quantity"
                              @click="
                                item.real_quantity = item.real_quantity
                                  ? item.real_quantity
                                  : null
                              "
                              @focusout="
                                item.real_quantity = item.real_quantity
                                  ? item.real_quantity
                                  : 0
                              "
                            />
                            <div class="input-group-text">dona</div>
                            <div class="input-group-append">
                              <button class="btn btn-outline-info">
                                <i class="fa fa-share"></i>
                              </button>
                            </div>
                          </div>
                        </form>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2">
                        <Pagination
                          v-model="products_waiting"
                          @get="getProductsWaiting"
                        />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div class="col-md-6">
              <h5>Sanalgan</h5>
              <div class="input-group input-group-sm">
                <input
                  type="search"
                  class="form-control"
                  placeholder="Qidiruv"
                  v-model="products_counted.code"
                  @input="
                    products_counted.current_page = 0;
                    products_counted.limit = 25;
                    getProductsCounted();
                  "
                />
                <div class="input-group-text">
                  <i class="fa fa-barcode" />
                </div>
              </div>
              <div class="responsive-y" style="max-height: 60vh">
                <table class="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Mahsulot - Artikul - Marka - Code</th>
                      <th>Hajm</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in products_counted.data" :key="item">
                      <td>
                        {{
                          item.category +
                          " - " +
                          item.product_type_name +
                          " - " +
                          item.product_type_name +
                          " - " +
                          item.code
                        }}
                      </td>
                      <td>
                        <form
                          @submit.prevent="
                            putProduct(item);
                            item.edit = false;
                          "
                        >
                          <div class="input-group input-group-sm">
                            <input
                              class="form-control"
                              type="number"
                              step="any"
                              min="0"
                              placeholder="miqdor"
                              required
                              v-model="item.real_quantity"
                              :readonly="!item.edit"
                              @dblclick="item.edit = true"
                            />
                            <div class="input-group-text">dona</div>
                            <div class="input-group-append" v-if="item.edit">
                              <button class="btn btn-outline-warning">
                                <i class="far fa-edit"></i>
                              </button>
                            </div>
                          </div>
                        </form>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="4">
                        <Pagination
                          v-model="products_counted"
                          @get="getProductsCounted"
                        />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </template>
        <template #2>
          <div class="row">
            <div class="col-md-12">
              <h5>Farqli</h5>
              <div class="input-group input-group-sm">
                <input
                  type="search"
                  class="form-control"
                  placeholder="Qidiruv"
                  v-model="products_not_equal.code"
                  @input="
                    products_not_equal.current_page = 0;
                    products_not_equal.limit = 25;
                    getProductsNotEqual();
                  "
                />
                <div class="input-group-text">
                  <i class="fa fa-barcode" />
                </div>
              </div>
              <div class="responsive-y" style="max-height: 60vh">
                <table class="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Mahsulot - Artikul - Marka - Code</th>
                      <th>Real hajm</th>
                      <th>Tizimdagi hajm</th>
                      <th>Farq</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in products_not_equal.data" :key="item">
                      <td>
                        {{
                          item.category +
                          " - " +
                          item.product_type_name +
                          " - " +
                          item.product_type_name +
                          " - " +
                          item.code
                        }}
                      </td>
                      <td>
                        <!-- <form @submit.prevent="putProduct(item)">
                        <div class="input-group input-group-sm">
                          <input
                            class="form-control"
                            type="number"
                            step="any"
                            min="0"
                            placeholder="miqdor"
                            required
                            v-model="item.real_quantity"
                            @click="
                              item.real_quantity = item.real_quantity
                                ? item.real_quantity
                                : null
                            "
                            @focusout="
                              item.real_quantity = item.real_quantity
                                ? item.real_quantity
                                : 0
                            "
                          />
                          <div class="input-group-text">dona</div>
                          <div class="input-group-append">
                            <button class="btn btn-outline-info">
                              <i class="fa fa-share"></i>
                            </button>
                          </div>
                        </div>
                      </form> -->
                        <form
                          @submit.prevent="
                            putProduct(item);
                            item.edit = false;
                          "
                        >
                          <div class="input-group input-group-sm">
                            <input
                              class="form-control"
                              type="number"
                              step="any"
                              min="0"
                              placeholder="miqdor"
                              required
                              v-model="item.real_quantity"
                              :readonly="!item.edit"
                              @dblclick="item.edit = true"
                            />
                            <div class="input-group-text">dona</div>
                            <div class="input-group-append" v-if="item.edit">
                              <button class="btn btn-outline-warning">
                                <i class="far fa-edit"></i>
                              </button>
                            </div>
                          </div>
                        </form>
                      </td>
                      <td>{{ `${$util.currency(item.quantity)} dona` }}</td>
                      <td>
                        <span
                          :class="
                            item.real_quantity - item.quantity > 0
                              ? 'text-warning'
                              : item.real_quantity - item.quantity < 0
                              ? 'text-danger'
                              : ''
                          "
                          v-if="item.real_quantity - item.quantity !== 0"
                        >
                          {{
                            `${$util.currency(
                              item.real_quantity - item.quantity
                            )} dona`
                          }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="4">
                        <Pagination
                          v-model="products_not_equal"
                          @get="getProductsNotEqual"
                        />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </template>
      </Tab>
    </div>
  </div>

  <Modal ref="revisionsModal">
    <template #body>
      <div class="row gap-2">
        <div class="col-12">
          <ul class="list-group">
            <li
              class="list-group-item"
              v-for="item in controls.data"
              :key="item"
            >
              <strong>ID: {{ item.id }}</strong>
              <span>{{ item.time.replace("T", " ").substring(0, 16) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </Modal>
</template>

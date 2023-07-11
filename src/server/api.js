import server from "./server";
import query from "./query";
import util from "./util";

export default {
  token(data) {
    return server(`token`, "post", util.formData(data));
  },
  // currency
  get_currencies() {
    return server(`get_currencies`);
  },
  create_currency(data) {
    return server(`create_currency`, "post", data);
  },
  update_currency(data) {
    return server(`update_currency`, "put", data);
  },
  // category
  get_categories(p = query) {
    const search = p.search ? `search=${p.search}` : ``;
    return server(`get_categories?page=${p.page}&limit=${p.limit}&${search}`);
  },
  create_category(data) {
    return server(`create_category`, "post", data);
  },
  update_category(data) {
    return server(`update_category`, "put", data);
  },
  // product type
  get_product_types(p = query) {
    const search = p.search ? `search=${p.search}` : ``;
    return server(
      `get_product_types?category_id=${p.category_id}&page=${p.page}&limit=${p.limit}&${search}`
    );
  },
  update_product_type(data) {
    return server(`update_product_type`, "put", data);
  },
  // user
  get_users(p = query) {
    return server(
      `get_users?branch_id=${p.branch_id}&page=${p.page}&limit=${p.limit}`
    );
  },
  this_user(p = query) {
    return server(`this_user?user_id=${p.user_id}`);
  },
  update_user(data) {
    return server(`update_user`, "put", data);
  },
  // customer
  get_customers(p = query) {
    const search = p.search ? `search=${p.search}` : ``;
    return server(
      `get_customers?branch_id=${p.branch_id}&page=${p.page}&limit=${p.limit}&${search}`
    );
  },
  get_customer(p = query) {
    return server(`get_customer/${p.customer_id}`);
  },
  update_customer(data) {
    return server(`update_customer`, "put", data);
  },
  // loan
  get_loans(p = query) {
    const status = p.status ? `status=${p.status}` : ``;
    return server(
      `get_loans/${p.status}?branch_id=${p.branch_id}&customer_id=${p.customer_id}&order_id=${p.order_id}&page=${p.page}&limit=${p.limit}`
    );
  },
  // statistic
  get_trade_statistics(p = query) {
    const time_query =
      p.from_time && p.to_time
        ? `from_time=${p.from_time}&to_time=${p.to_time}`
        : ``;
    return server(
      `get_trade_statistics?branch_id_admin=${p.branch_id_admin}&${time_query}`
    );
  },
};

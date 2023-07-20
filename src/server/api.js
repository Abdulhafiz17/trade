import server from "./server";
import query from "./query";
import util from "./util";

export default {
  token(data) {
    return server(`token`, "post", util.formData(data));
  },
  // branch
  get_branches(p = query) {
    return server(`get_branches?status=${p.status}&admin_id=${p.admin_id}`);
  },
  get_branch(p = query) {
    return server(`get_branch/${p.branch_id}`);
  },
  create_branch(data) {
    return server(`create_branch`, "post", data);
  },
  update_branch(data) {
    return server(`update_branch/${data.id}`, "put", data);
  },
  update_branch_status(data) {
    return server(`update_branch_status`, "put", data);
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
  // order
  get_orders(p = query) {
    const status = p.status ? `status=${p.status}` : ``;
    const time =
      p.from_time && p.to_time
        ? `from_time=${p.from_time}&to_time=${p.to_time}`
        : ``;
    return server(
      `get_orders?branch_id=${p.branch_id}&order_id=${p.order_id}&seller_id=${p.seller_id}&user_id=${p.user_id}&customer_id=${p.customer_id}&${status}&${time}&page=${p.page}&limit=${p.limit}`
    );
  },
  create_order() {
    return server(`create_order`, "post");
  },
  remove_order(p = query) {
    return server(`remove_order/${p.order_id}`, "delete");
  },
  order_confirmation(data) {
    return server(`order_confirmation`, "put", data);
  },
  get_returned_products(p = query) {
    const time =
      p.from_time && p.to_time
        ? `from_time=${p.from_time}&to_time=${p.to_time}`
        : ``;
    return server(
      `get_returned_products?order_id=${p.order_id}&branch_id=${p.branch_id}&${time}&page=${p.page}&limit=${p.limit}`
    );
  },
  return_product(data) {
    return server(`return_product`, "put", data);
  },
  // trade
  get_trades(p = query) {
    return server(`get_trades/${p.order_id}?branch_id=${p.branch_id}`);
  },
  to_trade(data) {
    return server(`to_trade`, "post", data);
  },
  to_trade_for_tarozi(data) {
    return server(`to_trade_for_tarozi`, "post", data);
  },
  update_trade(data) {
    return server(`update_trade`, "put", data);
  },
  remove_trade(p = query) {
    return server(`remove_trade/${p.trade_id}`, "delete");
  },
  // product
  get_faulty_products() {
    return server(`get_faulty_products`);
  },
  get_product(p = query) {
    return server(`get_product/${p.code}`);
  },
  get_products(p = query) {
    const search = p.search ? `search=${p.search}` : ``;
    const status = p.status ? `status=${p.status}` : ``;
    return server(
      `get_products?${search}&${status}&branch_id=${p.branch_id}&page=${p.page}&limit=${p.limit}`
    );
  },
  get_products_for_trade(p = query) {
    return server(`get_products_for_trade/${p.code}`);
  },
  get_opened_products(p = query) {
    const search = p.search ? `search=${p.search}` : ``;
    return server(
      `get_opened_products?${search}&branch_id=${p.branch_id}&page=${p.page}&limit=${p.limit}`
    );
  },
  get_opened_products_for_trade(p = query) {
    return server(`get_opened_products_for_trade/${p.o_pr_id}`);
  },
  update_product(data) {
    return server(`update_product`, "put", data);
  },
  update_opened_product(data) {
    return server(`update_opened_product`, "put", data);
  },
  // product composition
  create_product_composition(data) {
    return server(`create_product_composition`, "post", data);
  },
  update_product_composition(data) {
    return server(`update_product_composition`, "put", data);
  },
  // unit
  get_olchov_birliglar(p = query) {
    return server(`get_olchov_birliglar/${p.code}`);
  },
  create_olchov_birligi(data) {
    return server(`create_olchov_birligi`, "post", data);
  },
  delete_olchov_birligi(p = query) {
    return server(`delete_olchov_birligi/${p.id}`, "delete");
  },
  // loan
  get_loans(p = query) {
    const status = p.status ? `status=${p.status}` : ``;
    return server(
      `get_loans/${p.status}?customer_id=${p.customer_id}&order_id=${p.order_id}&page=${p.page}&limit=${p.limit}`
    );
  },
  get_loans_customer(p = query) {
    const status = p.status ? `status=${p.status}` : ``;
    return server(
      `get_loans_customer/${p.status}?customer_id=${p.customer_id}&page=${p.page}&limit=${p.limit}`
    );
  },
  get_loan(p = query) {
    return server(`get_loan?order_id=${p.order_id}&loan_id=${p.loan_id}`);
  },
  take_loan(data) {
    return server(`take_loan`, "post", data);
  },
  // income
  get_incomes(p = query) {
    return server(
      `get_incomes/${p.source}/${p.status}?page=${p.page}&limit=${p.limit}`
    );
  },
  // fixed expense
  get_fixed_expenses() {
    return server(`get_fixed_expenses`);
  },
  create_fixed_expense(data) {
    return server(`create_fixed_expense`, "post", data);
  },
  update_fixed_expense(data) {
    return server(`update_fixed_expense`, "put", data);
  },
  // expense
  get_variable_expenses(p = query) {
    const time =
      p.from_time && p.to_time
        ? `from_time=${p.from_time}&to_time=${p.to_time}`
        : ``;
    return server(
      `get_variable_expenses?branch_id=${p.branch_id}&${time}&page=${p.page}&limit=${p.limit}`
    );
  },
  fixed_expenses_get(p = query) {
    const time =
      p.from_time && p.to_time
        ? `from_time=${p.from_time}&to_time=${p.to_time}`
        : ``;
    return server(
      `fixed_expenses_get?branch_id=${p.branch_id}&${time}&fixed_expense_id=${p.fixed_expense_id}&page=${p.page}&limit=${p.limit}`
    );
  },
  get_party_expenses(p = query) {
    return server(
      `get_party_expenses/${p.party_id}?page=${p.page}&limit=${p.limit}`
    );
  },
  get_market_expenses(p = query) {
    const time =
      p.from_time && p.to_time
        ? `from_time=${p.from_time}&to_time=${p.to_time}`
        : ``;
    return server(
      `get_market_expenses/${p.market_id}?${time}&page=${p.page}&limit=${p.limit}`
    );
  },
  get_user_expenses(p = query) {
    const time =
      p.from_time && p.to_time
        ? `from_time=${p.from_time}&to_time=${p.to_time}`
        : ``;
    return server(
      `get_user_expenses?${p.user_id}&${time}&page=${p.page}&limit=${p.limit}`
    );
  },
  pay_for_variable_expense(data) {
    return server(`pay_for_variable_expense`, "post", data);
  },
  pay_for_party_expense(data) {
    return server(`pay_for_party_expense`, "post", data);
  },
  pay_for_fixed_expense(data) {
    return server(`pay_for_fixed_expense`, "post", data);
  },
  pay_for_market_expense(data) {
    return server(`pay_for_market_expense`, "post", data);
  },
  pay_to_user(data) {
    return server(`pay_to_user`, "post", data);
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

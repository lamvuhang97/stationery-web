import { response } from "./response.js";
import { authentications } from "./authentications";
import { users } from "./users";
import { subscribers } from "./subscribers";
import { transactions } from "./transactions";
import { category } from "./category";
import { products } from "./products";
import { carts } from "./carts";
import { orders }from "./orders";
import {reviews} from "./reviews";
import {address} from './address';
import {history} from "./history";

const api = {
  response,
  authentications,
  users,
  subscribers,
  transactions,
  category,
  products,
  carts, 
  orders,
  reviews,
  address,
  history
};

export default api;

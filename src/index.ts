import SslCommerzPayment from "./api/payment-controller";

export default class SSLCommerzPayment extends SslCommerzPayment {
  constructor(store_id: string, store_password: string, live = false) {
    super({ store_id: store_id, store_passwd: store_password, live: live });
  }
}

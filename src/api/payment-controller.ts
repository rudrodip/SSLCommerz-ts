import httpCall from "./fetch";
import paymentInitDataProcess from "./payment-init-data-process";

import { HttpCallOptions } from "../types";
import { PaymentInitData } from "../types";
import { HttpMethod } from "../types";

interface SslCommerzPaymentOptions {
  store_id: string;
  store_passwd: string;
  live?: boolean;
}

export default class SslCommerzPayment {
  private baseURL: string;
  private initURL: string;
  private validationURL: string;
  private refundURL: string;
  private refundQueryURL: string;
  private transactionQueryBySessionIdURL: string;
  private transactionQueryByTransactionIdURL: string;
  private store_id: string;
  private store_passwd: string;

  constructor({
    store_id,
    store_passwd,
    live = false,
  }: SslCommerzPaymentOptions) {
    this.baseURL = `https://${live ? "securepay" : "sandbox"}.sslcommerz.com`;
    this.initURL = `${this.baseURL}/gwprocess/v4/api.php`;
    this.validationURL = `${this.baseURL}/validator/api/validationserverAPI.php?`;
    this.refundURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
    this.refundQueryURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
    this.transactionQueryBySessionIdURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
    this.transactionQueryByTransactionIdURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
    this.store_id = store_id;
    this.store_passwd = store_passwd;
  }

  private buildConfig<T>(options: BuildConfigOptions<T>): HttpCallOptions {
    const { url, method, data } = options;
    return {
      url,
      method,
      data:
        data !== undefined
          ? paymentInitDataProcess(data as PaymentInitData)
          : undefined,
    };
  }

  private buildUrlWithValidation(
    data: { val_id: string },
    url?: string
  ): string {
    return (
      url ||
      `${this.validationURL}val_id=${data.val_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`
    );
  }

  init(data: PaymentInitData, url?: string, method: HttpMethod = "POST") {
    const config = this.buildConfig<PaymentInitData>({
      url: url || this.initURL,
      method,
      data,
    });
    return httpCall(config as HttpCallOptions);
  }

  validate(data: { val_id: string }, url?: string, method: HttpMethod = "GET") {
    const validationUrl = this.buildUrlWithValidation(data, url);
    return httpCall(this.buildConfig({ url: validationUrl, method }));
  }

  initiateRefund(
    data: {
      refund_amount: string;
      refund_remarks: string;
      bank_tran_id: string;
      refe_id: string;
    },
    url?: string,
    method: HttpMethod = "GET"
  ) {
    const refundUrl =
      url ||
      `${this.refundURL}refund_amount=${data.refund_amount}&refund_remarks=${data.refund_remarks}&bank_tran_id=${data.bank_tran_id}&refe_id=${data.refe_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`;
    return httpCall(this.buildConfig({ url: refundUrl, method }));
  }

  refundQuery(
    data: { refund_ref_id: string },
    url?: string,
    method: HttpMethod = "GET"
  ) {
    const refundQueryUrl =
      url ||
      `${this.refundQueryURL}refund_ref_id=${data.refund_ref_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`;
    return httpCall(this.buildConfig({ url: refundQueryUrl, method }));
  }

  transactionQueryBySessionId(
    data: { sessionkey: string },
    url?: string,
    method: HttpMethod = "GET"
  ) {
    const sessionIdUrl =
      url ||
      `${this.transactionQueryBySessionIdURL}sessionkey=${data.sessionkey}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`;
    return httpCall(this.buildConfig({ url: sessionIdUrl, method }));
  }

  transactionQueryByTransactionId(
    data: { tran_id: string },
    url?: string,
    method: HttpMethod = "GET"
  ) {
    const transactionIdUrl =
      url ||
      `${this.transactionQueryByTransactionIdURL}tran_id=${data.tran_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`;
    return httpCall(this.buildConfig({ url: transactionIdUrl, method }));
  }
}

interface BuildConfigOptions<T> {
  url: string;
  method: HttpMethod;
  data?: T;
}

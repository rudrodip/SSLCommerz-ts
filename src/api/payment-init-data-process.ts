import FormData from "form-data";
import { PaymentInitData } from "../types";

const paymentInitDataProcess = (data: PaymentInitData): FormData => {
  const fdata = new FormData();

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key as keyof PaymentInitData];
      if (value !== undefined && value !== null && value !== "") {
        fdata.append(key, value.toString());
      }
    }
  }

  return fdata;
};

export default paymentInitDataProcess;

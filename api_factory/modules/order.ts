import { GATEWAY_ENDPOINT } from "../axios.config";

export interface OrderPayload {
    vendorId: string;
    phoneNumber:  string;
    deliveryType: string;
    location:  string;
    address: string;
    items: Record<string, any> [],
    notes?: string
  }

export const order_api = {
  $_create_order: (payload: OrderPayload) => {
    let url = `/orders`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_fetch_vendor_orders: () => {
    let url = `/orders`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_vendor_todays_order: () => {
    let url = `/orders/today`;
    return GATEWAY_ENDPOINT.get(url);
  }
};

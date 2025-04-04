import { GATEWAY_ENDPOINT } from "../axios.config";

export const vendor_api = {
  $_open_store: () => {
    let url = `/vendor/open-store`;
    return GATEWAY_ENDPOINT.patch(url);
  },
  $_close_store: () => {
    let url = `/vendor/close-store`;
    return GATEWAY_ENDPOINT.patch(url);
  },
  $_fetch_wallet: () => {
    let url = `/vendor/wallet`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_fetch_vendors: () => {
    let url = `/vendor`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_fetch_vendor_by_id: (id: string) => {
    let url = `/vendor/${id}`;
    return GATEWAY_ENDPOINT.get(url);
  }
};

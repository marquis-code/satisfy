import { GATEWAY_ENDPOINT } from "../axios.config";

export interface UpdateMenu {
  name: string
}

export interface MenuPayload {
  name: string;
  price: number;
  categoryId: string;

}

export const menu_api = {
  $_create_menue: (payload: MenuPayload) => {
    let url = `/menu`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_fetch_menu: () => {
    let url = `/menu`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_edit_menu: (id: string, payload: UpdateMenu) => {
    let url = `/menu/${id}`;
    return GATEWAY_ENDPOINT.patch(url, payload);
  },
  $_delete_menu: (id: string) => {
    let url = `/menu/${id}`;
    return GATEWAY_ENDPOINT.delete(url);
  },
  $_enable_menu: (id: string) => {
    let url = `/menu/${id}/enable`;
    return GATEWAY_ENDPOINT.patch(url);
  },
  $_disable_menu: (id: string) => {
    let url = `/menu/${id}/disable`;
    return GATEWAY_ENDPOINT.patch(url);
  },
  $_fetch_vendor_menu: (id: string) => {
    let url = `/menu/${id}`;
    return GATEWAY_ENDPOINT.get(url);
  },
};

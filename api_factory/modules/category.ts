import { GATEWAY_ENDPOINT } from "../axios.config";

export interface UpdateCategory {
  name: string
}

export interface CategoryPayload {
  name: string;
}

export const category_api = {
  $_create_mcategory: (payload: CategoryPayload) => {
    let url = `/category`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_fetch_category: () => {
    let url = `/category`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_edit_category: (id: string, payload: UpdateCategory) => {
    let url = `/category/${id}`;
    return GATEWAY_ENDPOINT.patch(url, payload);
  },
  $_delete_category: (id: string) => {
    let url = `/category/${id}`;
    return GATEWAY_ENDPOINT.delete(url);
  }
};

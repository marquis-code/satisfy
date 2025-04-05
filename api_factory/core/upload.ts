import { GATEWAY_ENDPOINT } from '../axios.config'

export const core_apis = {
	$_upload: (payload: any) => {
		const url = '/image/upload'
		return GATEWAY_ENDPOINT.post(url, payload)
	}
}

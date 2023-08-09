import axios from 'axios';
import baseurl from './baseurl';
import store from '../store/index';
import handleError from './handle';

export default async function server(
	endpoint = '',
	method = 'get',
	data = null
) {
	await store.dispatch('setLoading', true);

	let token = store.state.user?.access_token;
	let result, error;

	await axios
		.request({
			baseURL: baseurl + endpoint,
			headers: { Authorization: `Bearer ${token}` },
			method: method,
			data: data,
		})
		.then((res) => {
			result = res;
		})
		.catch((err) => {
			error = err;
			handleError(err);
		})
		.finally(() => {
			store.dispatch('setLoading', false);
		});

	return new Promise((resolve, reject) => {
		if (result) resolve(result);
		else reject(error);
	});
}

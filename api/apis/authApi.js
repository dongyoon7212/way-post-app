import * as SecureStore from "expo-secure-store";
import { instance } from "../utils/instance";

export const getPrincipal = async () => {
	const token = await SecureStore.getItemAsync("accessToken");

	if (!token) return null;

	try {
		const response = await instance.get("/auth/principal", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.status === 200) {
			return response.data.user;
		}
		return null;
	} catch (error) {
		return null;
	}
};

export const signupRequest = async (data) => {
	try {
		const response = await instance.post("/auth/signup", data);
		return response;
	} catch (error) {
		console.log(error);
		return error.response;
	}
};

export const signinRequest = async (data) => {
	try {
		const response = instance.post("/auth/signin", data);
		return response;
	} catch (error) {
		console.log(error);
		return error.response;
	}
};

export const usernameDuplChkRequest = async (username) => {
	try {
		const response = instance.get(
			`/auth/duplChk/username?username=${username}`
		);
		return response;
	} catch (error) {
		console.log(error);
		return error.response;
	}
};

export const emailDuplChkRequest = async (email) => {
	try {
		const response = instance.get(`/auth/duplChk/email?email=${email}`);
		return response;
	} catch (error) {
		console.log(error);
		return error.response;
	}
};

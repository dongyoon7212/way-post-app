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
		return response.data;
	} catch (error) {
		throw error;
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

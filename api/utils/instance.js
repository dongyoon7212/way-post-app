import axios from "axios";
import getServerAddress from "../../constants/serverAddress";

export const instance = axios.create({
	baseURL: getServerAddress(),
	// headers: {
	// 	Authorization:
	// 		!!SecureStore.getItemAsync("accessToken") &&
	// 		"Bearer " + SecureStore.getItemAsync("accessToken"),
	// },
});

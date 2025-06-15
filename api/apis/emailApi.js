import { instance } from "../utils/instance";

export const emailVerificationCodeSendRequest = async (data) => {
	try {
		const response = instance.post("/mail/send-code", data);
		return response;
	} catch (error) {
		console.log(error);
		return error.response;
	}
};

export const emailVerificationCodeCheckRequest = async (data) => {
	try {
		const response = instance.post("/mail/verify-code", data);
		return response;
	} catch (error) {
		console.log(error);
		return error.response;
	}
};

export const sendResetCodeMailRequest = async (data) => {
	try {
		const response = instance.post("/mail/send-reset-code", data);
		return response;
	} catch (error) {
		console.log(error);
		return error.response;
	}
};

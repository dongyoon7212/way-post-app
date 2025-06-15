import { instance } from "../utils/instance";

export const editProfileImg = async (data) => {
	try {
		const response = instance.post("/account/edit/profileimg", data);
		return response;
	} catch (error) {
		return error;
	}
};

export const getUserById = async (data) => {
	try {
		const response = instance.get(`/account/get/user?userId=${data}`);
		return response;
	} catch (error) {
		return error;
	}
};

export const editIntroduce = async (data) => {
	try {
		const response = instance.post("/account/edit/introduce", data);
		return response;
	} catch (error) {
		return error;
	}
};

export const follow = async (data) => {
	try {
		const response = instance.post("/account/follow/add", data);
		return response;
	} catch (error) {
		return error;
	}
};

export const unfollow = async (data) => {
	try {
		const response = instance.post("/account/follow/remove", data);
		return response;
	} catch (error) {
		return error;
	}
};

export const getFollowerList = async (data) => {
	try {
		const response = instance.get(
			`/account/get/followerList?userId=${data}`
		);
		return response;
	} catch (error) {
		return error;
	}
};

export const getFollowingList = async (data) => {
	try {
		const response = instance.get(
			`/account/get/followingList?userId=${data}`
		);
		return response;
	} catch (error) {
		return error;
	}
};

export const changePasswordRequest = async (data) => {
	try {
		const response = instance.post("/account/change-password", data);
		return response;
	} catch (error) {
		return error;
	}
};

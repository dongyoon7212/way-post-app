import { instance } from "../utils/instance";

export const uploadPhotoPost = async (data) => {
	try {
		const response = instance.post("/post/photo/upload", data);
		return response;
	} catch (error) {
		return error;
	}
};

export const getPhotoPostList = async (params) => {
	try {
		const response = instance.get("/post/photo/getList", { params });
		return response;
	} catch (error) {
		return error;
	}
};

export const getPhotoPostListByUserId = async (params) => {
	try {
		const response = instance.get(`/post/photo/getList/${params}`);
		return response;
	} catch (error) {
		return error;
	}
};

export const addComment = async (data) => {
	try {
		const response = instance.post("/post/photo/comment/add", data);
		return response;
	} catch (error) {
		return error;
	}
};

export const removePhotoPost = async (params) => {
	try {
		const response = instance.post(`/post/photo/remove/${params}`);
		return response;
	} catch (error) {
		return error;
	}
};

export const addLike = async (data) => {
	try {
		const response = instance.post("/post/photo/like/add", data);
		return response;
	} catch (error) {
		return error;
	}
};

export const removeLike = async (data) => {
	try {
		const response = instance.post("/post/photo/like/remove", data);
		return response;
	} catch (error) {
		return error;
	}
};

export const getHotPhotoPostList = async () => {
	try {
		const response = instance.get("/post/photo/getList/hot");
		return response;
	} catch (error) {
		return error;
	}
};

export const getRecentPhotoPostList = async () => {
	try {
		const response = instance.get("/post/photo/getList/recent");
		return response;
	} catch (error) {
		return error;
	}
};

export const getPhotoPostListByPosition = async (params) => {
	try {
		const response = instance.get("/post/photo/getList/position", {
			params,
		});
		return response;
	} catch (error) {
		return error;
	}
};

export const editPhotoPostText = async (data) => {
	try {
		const response = instance.post("/post/photo/edit/text", data);
		return response;
	} catch (error) {
		return error;
	}
};

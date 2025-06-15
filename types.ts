export interface principalData {
	data: {
		user: User;
	};
}

export interface User {
	userId: number;
	email: string;
	username: string;
	profileImg: string;
	userRoles: UserRole[];
	introduce: string;
	isEnabled: number;
	dctvdDt: string;
}

export interface UserRole {
	userId: number;
	roleId: number;
	userRoleId: number;
	regDt: string;
	updDt: string;
	role: Role;
}

export interface Role {
	roleId: number;
	roleName: string;
	roleNameKor: string;
}

export interface GetUserResponse {
	followingCount: number;
	followerCount: number;
	isFollowed: number;
	user: User;
}

export interface Metadata {
	Model: string;
	latitude: number;
	longitude: number;
}

export interface Comment {
	commentId: number;
	photoPostId: number;
	userId: number;
	content: string;
	regDt: string;
	updDt: string;
	user: User;
}

export interface PhotoPost {
	photoPostId: number;
	userId: number;
	postText: string;
	imgUrl: string;
	cameraModel: string;
	locationAddress: string;
	isLiked: number;
	likeCount: number;
	latitude: number;
	longitude: number;
	regDt: string;
	updDt: string;
	user: User;
	comments: Comment[];
}


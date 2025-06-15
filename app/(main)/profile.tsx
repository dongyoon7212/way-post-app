import { getUserById } from "@/api/apis/accountApi";
import { getPhotoPostListByUserId } from "@/api/apis/postApi";
import PostGridItem from "@/components/PostGridItem";
import { useAuthStore } from "@/stores/useAuthStore";
import { GetUserResponse, PhotoPost } from "@/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";

export default function ProfileScreen() {
	const { principal } = useAuthStore();
	const [userData, setUserData] = useState<GetUserResponse>();
	const [postGroup, setPostGroup] = useState<PhotoPost[]>([]);
	const screenWidth = Dimensions.get("window").width;
	const GAP = 1;
	const imageSize = (screenWidth - GAP * 2) / 3;
	const router = useRouter();

	useEffect(() => {
		getUserById(principal?.userId).then((response) => {
			const typedResponse = response as {
				status: number;
				data: GetUserResponse;
			};
			if (typedResponse.status === 200) {
				setUserData(typedResponse.data);
			}
		});
		getPhotoPostListByUserId(principal?.userId).then((response) => {
			const typedResponse = response as {
				status: number;
				data: PhotoPost[];
			};
			if (typedResponse.status === 200) {
				setPostGroup(typedResponse.data);
			}
		});
	}, [principal]);

	return (
		<View style={styles.container}>
			{/* 프로필 정보 */}
			<View style={styles.profileContainer}>
				<View style={styles.header}>
					<Image
						source={{ uri: principal?.profileImg }}
						style={styles.profileImage}
					/>
					<View style={styles.stats}>
						<View style={styles.statBlock}>
							<Text style={styles.statNumber}>
								{postGroup.length}
							</Text>
							<Text style={styles.statLabel}>게시물</Text>
						</View>
						<View style={styles.statBlock}>
							<Text style={styles.statNumber}>
								{userData?.followerCount}
							</Text>
							<Text style={styles.statLabel}>팔로워</Text>
						</View>
						<View style={styles.statBlock}>
							<Text style={styles.statNumber}>
								{userData?.followingCount}
							</Text>
							<Text style={styles.statLabel}>팔로잉</Text>
						</View>
					</View>
				</View>

				{/* 사용자 이름 */}
				<Text style={styles.introduce}>{principal?.introduce}</Text>

				{/* 편집 버튼 */}
				<Pressable style={styles.editButton}>
					<Text style={styles.editText}>프로필 편집</Text>
				</Pressable>
			</View>

			{/* 게시물 그리드 */}
			<FlatList
				style={styles.grid}
				data={postGroup}
				numColumns={3}
				keyExtractor={(post: PhotoPost) => post.photoPostId.toString()}
				renderItem={({ item }: { item: PhotoPost }) => (
					<Pressable
						onPress={() =>
							router.push({
								pathname: "/(main)/post/[photoPostId]",
								params: {
									userId: item.userId,
									photoPostId: item.photoPostId,
								},
							})
						}
					>
						<PostGridItem uri={item.imgUrl} size={imageSize} />
					</Pressable>
				)}
				contentContainerStyle={{
					paddingHorizontal: 0,
					paddingBottom: 60,
				}}
				columnWrapperStyle={{
					justifyContent: "space-between",
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	profileContainer: {
		paddingHorizontal: 20,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 20,
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginRight: 24,
	},
	stats: {
		flexDirection: "row",
		justifyContent: "space-around",
		flex: 1,
	},
	statBlock: {
		alignItems: "center",
	},
	statNumber: {
		fontSize: 22,
		fontWeight: "bold",
	},
	statLabel: {
		color: "#666",
		fontSize: 14,
		marginTop: 4,
	},
	introduce: {
		fontSize: 16,
		marginBottom: 12,
	},
	editButton: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		paddingVertical: 8,
		alignItems: "center",
		marginBottom: 20,
	},
	editText: {
		fontSize: 14,
		color: "#333",
	},
	grid: {
		paddingHorizontal: 0,
	},
});

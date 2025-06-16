import { getPhotoPostListByUserId } from "@/api/apis/postApi";
import PostItem from "@/components/PostItem";
import { PhotoPost } from "@/types";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
	Dimensions,
	FlatList,
	Keyboard,
	KeyboardAvoidingView,
	LayoutAnimation,
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	UIManager,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function PostDetailScreen() {
	const router = useRouter();
	const [postGroup, setPostGroup] = useState<PhotoPost[]>([]);
	const [initialIndex, setInitialIndex] = useState(0);
	const { photoPostId, userId } = useLocalSearchParams<{
		photoPostId: string;
		userId: string;
	}>();
	const [openedPostId, setOpenedPostId] = useState<number | null>(null);

	const listRef = useRef<FlatList>(null);

	useEffect(() => {
		if (Platform.OS === "android") {
			UIManager.setLayoutAnimationEnabledExperimental?.(true);
		}
	}, []);

	const toggleCommentOpen = (postId: number) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setOpenedPostId((prev) => (prev === postId ? null : postId));
	};

	useEffect(() => {
		if (postGroup.length > 0) {
			const index = postGroup.findIndex(
				(post) => post.photoPostId.toString() === photoPostId
			);
			if (index !== -1) {
				setTimeout(() => {
					listRef.current?.scrollToIndex({ index, animated: false });
				}, 0);
			}
		}
	}, [postGroup]);

	useEffect(() => {
		// 게시물 정보 가져오기 (여기선 유저 ID가 이미 있다고 가정)
		getPhotoPostListByUserId(userId).then((response) => {
			const typedResponse = response as {
				status: number;
				data: PhotoPost[];
			};

			if (typedResponse.status === 200) {
				setPostGroup(typedResponse.data);

				// ✅ index 계산
				const index = typedResponse.data.findIndex(
					(post) => post.photoPostId.toString() === photoPostId
				);
				if (index !== -1) {
					setInitialIndex(index);
				}
			}
		});
	}, []);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // ✅ 추가
			style={{ flex: 1 }}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<FlatList
					data={postGroup}
					ref={listRef}
					keyExtractor={(item) => item.photoPostId.toString()}
					keyboardShouldPersistTaps="handled"
					removeClippedSubviews={false}
					scrollEnabled={true}
					onScrollToIndexFailed={({ index }) => {
						setTimeout(() => {
							listRef.current?.scrollToIndex({
								index,
								animated: false,
							});
						}, 50);
					}}
					contentContainerStyle={{ paddingBottom: 100 }}
					renderItem={({ item }) => (
						<PostItem
							item={item}
							isOpened={openedPostId === item.photoPostId}
							toggleCommentOpen={toggleCommentOpen}
						/>
					)}
					style={styles.postContainer}
				/>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	postContainer: {
		width: screenWidth,
		flex: 1,
		backgroundColor: "#fff",
	},
});

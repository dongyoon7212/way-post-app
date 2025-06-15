// components/PostItem.tsx
import { Comment, PhotoPost } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { memo, useRef, useState } from "react";
import {
	Image,
	Keyboard,
	LayoutAnimation,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	UIManager,
	View,
} from "react-native";

type Props = {
	item: PhotoPost;
	isOpened: boolean;
	toggleCommentOpen: (postId: number) => void;
};

function PostItem({ item, isOpened, toggleCommentOpen }: Props) {
	const [commentText, setCommentText] = useState("");

	const inputRef = useRef<TextInput>(null);

	if (!isOpened) {
		setTimeout(() => {
			inputRef.current?.focus();
		}, 350); // ✅ 너무 빠르면 LayoutAnimation 중간에 focus되어 문제 발생
	}

	// Android LayoutAnimation 설정
	if (Platform.OS === "android") {
		UIManager.setLayoutAnimationEnabledExperimental?.(true);
	}

	const handleToggleComment = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		toggleCommentOpen(item.photoPostId);
		if (!isOpened) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 200);
		}
	};

	return (
		<View style={styles.postContainer}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.userInfo}>
					<Image
						source={{ uri: item.user.profileImg }}
						style={styles.avatar}
					/>
					<Text style={styles.username}>{item.user.username}</Text>
				</View>
			</View>

			{/* Image */}
			<Image
				source={{ uri: item.imgUrl }}
				style={styles.postImage}
				resizeMode="cover"
			/>

			{/* Action Icons */}
			<View style={styles.actions}>
				<Ionicons name="heart-outline" size={26} />
				<Ionicons
					name="chatbubble-outline"
					size={26}
					style={{ marginLeft: 12 }}
				/>
				<Ionicons
					name="paper-plane-outline"
					size={26}
					style={{ marginLeft: 12 }}
				/>
			</View>

			{/* Caption */}
			<Text style={styles.caption}>{item.postText}</Text>

			{/* Comment Summary */}
			<Pressable onPress={handleToggleComment}>
				<Text style={styles.commentSummary}>
					댓글 {item.comments.length}개 모두 보기
				</Text>
			</Pressable>

			{/* Expanded Comments */}
			{isOpened && (
				<>
					<View style={styles.comments}>
						{item.comments.map((c: Comment) => (
							<Text key={c.commentId} style={styles.comment}>
								<Text style={styles.commentAuthor}>
									{c.user.username}
								</Text>{" "}
								{c.content}
							</Text>
						))}
					</View>

					{/* Comment Input */}
					<View style={styles.commentInputContainer}>
						<TextInput
							ref={inputRef}
							value={commentText}
							onChangeText={setCommentText}
							placeholder="댓글 달기..."
							placeholderTextColor="#aaa"
							style={styles.commentInput}
							returnKeyType="done"
						/>
						<Pressable
							onPress={() => {
								// submit 로직 여기에 구현
								Keyboard.dismiss();
								setCommentText("");
							}}
						>
							<Text style={styles.submitButton}>게시</Text>
						</Pressable>
					</View>
				</>
			)}
		</View>
	);
}

export default memo(PostItem); // 최적화를 위해 memo 적용

const styles = StyleSheet.create({
	postContainer: {
		width: "100%",
		backgroundColor: "#fff",
	},
	postImage: {
		width: "100%",
		aspectRatio: 1,
	},
	header: {
		padding: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	avatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		marginRight: 8,
	},
	username: {
		fontSize: 16,
		fontWeight: "bold",
	},
	actions: {
		flexDirection: "row",
		padding: 12,
	},
	caption: {
		paddingHorizontal: 12,
		fontSize: 14,
	},
	commentSummary: {
		paddingHorizontal: 12,
		color: "#555",
		marginTop: 6,
		fontSize: 14,
	},
	comments: {
		paddingHorizontal: 12,
		marginTop: 6,
	},
	comment: {
		fontSize: 14,
		marginBottom: 4,
	},
	commentAuthor: {
		fontWeight: "bold",
	},
	commentInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	commentInput: {
		flex: 1,
		fontSize: 14,
		paddingVertical: 6,
		paddingHorizontal: 8,
		color: "#000",
	},
	submitButton: {
		color: "dodgerblue",
		fontWeight: "bold",
		marginLeft: 12,
	},
});

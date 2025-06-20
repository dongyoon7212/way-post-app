import { useAuthStore } from "@/stores/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useRef } from "react";
import { Image, Pressable, Text } from "react-native";
// @ts-ignore
import ActionSheet from "react-native-actionsheet";

export default function MainLayout() {
	const router = useRouter();
	const { principal, clearAuth } = useAuthStore();
	const actionSheetRef = useRef<ActionSheet>(null);

	const showActionSheet = () => {
		Haptics.selectionAsync();
		actionSheetRef.current?.show();
	};

	const handleAction = (index: number) => {
		if (index === 1) {
			// 로그아웃
			SecureStore.deleteItemAsync("accessToken");
			clearAuth();
			router.replace("/(main)/login");
		}
	};

	return (
		<>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						title: "홈",
						headerTitleAlign: "center",
						headerBackVisible: false,
						gestureEnabled: false,
						headerRight: () =>
							principal ? (
								<Pressable
									onPress={() =>
										router.push("/(main)/profile")
									}
									style={{ paddingRight: 0 }}
								>
									<Image
										source={{ uri: principal?.profileImg }}
										style={{
											width: 36,
											height: 36,
											borderRadius: 20,
										}}
									/>
								</Pressable>
							) : (
								<Pressable
									onPress={() => router.push("/(main)/login")}
									style={{ paddingRight: 0 }}
								>
									<Text
										style={{
											fontSize: 16,
											color: "dodgerblue",
										}}
									>
										로그인
									</Text>
								</Pressable>
							),
					}}
				/>

				<Stack.Screen
					name="profile"
					options={{
						title: principal?.username,
						headerTitleAlign: "center",
						headerShadowVisible: true,
						headerRight: () => (
							<Pressable
								onPress={showActionSheet}
								style={{ paddingRight: 0 }}
							>
								<Ionicons name="menu" size={24} color="#333" />
							</Pressable>
						),
					}}
				/>
				<Stack.Screen
					name="post/[photoPostId]"
					options={{
						title: "",
					}}
				/>
				<Stack.Screen
					name="post/uploadPost"
					options={{
						title: "게시물 추가",
						presentation: "modal",
						animation: "slide_from_bottom",
					}}
				/>
			</Stack>

			{/* 액션시트 */}
			<ActionSheet
				ref={actionSheetRef}
				title={"설정"}
				options={["취소", "로그아웃"]}
				cancelButtonIndex={0}
				destructiveButtonIndex={1}
				onPress={handleAction}
			/>
		</>
	);
}

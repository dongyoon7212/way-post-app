import { Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function MainLayout() {
	const router = useRouter();

	return (
		<Stack>
			{/* 탭 내비게이션은 이 화면에서 동작 */}
			<Stack.Screen
				name="index"
				options={{
					title: "홈",
					headerTitleAlign: "center",
					headerShadowVisible: false,
					headerBackVisible: false,
					gestureEnabled: false,
					headerRight: () => (
						<Pressable
							onPress={() => router.push("/(main)/login")}
							style={{ paddingRight: 16 }}
						>
							<Text style={{ fontSize: 16, color: "dodgerblue" }}>
								로그인
							</Text>
						</Pressable>
					),
				}}
			/>

			{/* 로그인은 Stack 안에 포함되므로 header 자동으로 생김 */}
			<Stack.Screen
				name="login"
				options={{
					title: "",
					headerTitleAlign: "center",
					headerShadowVisible: false,
				}}
			/>
		</Stack>
	);
}

//Haptics.selectionAsync()	가장 짧고 가벼운 선택 피드백 (UI 요소 클릭용)
// Haptics.impactAsync('light')	가벼운 충격
// Haptics.impactAsync('medium')	중간 충격
// Haptics.notificationAsync('success')	성공 알림용

import { Stack } from "expo-router";

export default function AuthLayout() {
	return (
		<Stack screenOptions={{ headerTitleAlign: "center" }}>
			<Stack.Screen name="login" options={{ headerShown: false }} />
			// 로그인 화면의 제목 설정
		</Stack>
	);
}

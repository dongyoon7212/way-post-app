import { Stack } from "expo-router";

export default function JoinLayout() {
	return (
		<Stack
			screenOptions={{
				headerTitleAlign: "center",
				headerShadowVisible: false,
				headerShown: false, // ✅ 상단 헤더 전체 숨김
			}}
		>
			<Stack.Screen name="success" options={{ headerShown: false }} />
		</Stack>
	);
}

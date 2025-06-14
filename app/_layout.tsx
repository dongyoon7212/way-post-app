import { Stack } from "expo-router";

export default function Layout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="(main)"
				options={{ headerShown: false, animation: "fade" }} // ✅ 상단 제목 제거
			/>
		</Stack>
	);
}

import * as Haptics from "expo-haptics";
import { Tabs, useRouter } from "expo-router";

export default function TabLayout() {
	const router = useRouter();

	return (
		<Tabs
			screenListeners={{
				tabPress: () => {
					Haptics.selectionAsync(); // 탭 터치 시 짧은 햅틱 진동
				},
			}}
		>
			<Tabs.Screen name="index" options={{ title: "홈" }} />
			<Tabs.Screen name="explore" options={{ title: "탐색" }} />
			<Tabs.Screen name="login" options={{ title: "로그인" }} />
		</Tabs>
	);
}

//Haptics.selectionAsync()	가장 짧고 가벼운 선택 피드백 (UI 요소 클릭용)
// Haptics.impactAsync('light')	가벼운 충격
// Haptics.impactAsync('medium')	중간 충격
// Haptics.notificationAsync('success')	성공 알림용

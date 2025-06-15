// app/(auth)/signup-success.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SignupSuccessScreen() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.replace("/(main)");
		}, 3000); // 3초 후 홈으로 이동

		return () => clearTimeout(timer);
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.emoji}>🎉</Text>
			<Text style={styles.title}>회원가입 완료!</Text>
			<Text style={styles.subtitle}>이제 여행을 공유해보세요</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	emoji: {
		fontSize: 64,
		marginBottom: 24,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#111",
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 16,
		color: "#555",
		textAlign: "center",
	},
});

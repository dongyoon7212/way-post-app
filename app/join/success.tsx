// app/(auth)/signup-success.tsx
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
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
			<LottieView
				source={require("@/assets/lotties/fireworks.json")} // JSON 파일 경로
				autoPlay
				loop={false}
				style={styles.lottie}
			/>
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
		fontSize: 74,
		marginBottom: 24,
	},
	lottie: {
		width: 300,
		height: 300,
		marginBottom: -30,
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

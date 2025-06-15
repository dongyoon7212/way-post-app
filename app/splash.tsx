import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function SplashScreen() {
	const router = useRouter();

	useEffect(() => {
		const timeout = setTimeout(() => {
			router.replace("/(main)");
		}, 2000); // 2초 후 로그인 화면으로 이동

		return () => clearTimeout(timeout);
	}, []);

	return (
		<View style={styles.container}>
			{/* 로고 이미지 사용 시 */}
			<Image
				source={require("../assets/images/logo2.png")}
				style={styles.logo}
			/>

			{/* 텍스트만 사용 시 */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	logo: { width: 200, height: 200, resizeMode: "contain" },
});

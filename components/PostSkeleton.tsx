// components/PostSkeleton.tsx
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

export default function PostSkeleton({ size }: { size: number }) {
	return (
		<View style={[styles.container, { width: size, height: size }]}>
			<LottieView
				source={require("@/assets/lotties/skeleton.json")} // JSON 파일 경로
				autoPlay
				loop={true}
				style={styles.lottie}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#e0e0e0",
		overflow: "hidden",
	},
	lottie: {
		width: "100%",
		height: "100%",
	},
});

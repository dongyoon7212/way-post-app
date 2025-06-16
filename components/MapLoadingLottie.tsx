import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

export default function MapLoadingLottie() {
	return (
		<View style={styles.container}>
			<LottieView
				source={require("@/assets/lotties/loading.json")}
				autoPlay
				loop
				style={styles.lottie}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	lottie: {
		width: 200,
		height: 200,
	},
});

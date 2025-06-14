import { StyleSheet, Text, View } from "react-native";

export default function HomeTab() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>WayPost 탭 홈</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	title: { fontSize: 24, fontWeight: "bold" },
});

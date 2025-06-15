import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { getPrincipal } from "../../api/apis/authApi";

export default function HomeScreen() {
	const { data, isLoading } = useQuery({
		queryKey: ["getPrincipal"],
		queryFn: getPrincipal,
		retry: 1,
	});

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

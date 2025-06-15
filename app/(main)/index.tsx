import { useAuthStore } from "@/stores/useAuthStore";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getPrincipal } from "../../api/apis/authApi";

export default function HomeScreen() {
	const { setAuth } = useAuthStore();
	const { data, isLoading } = useQuery<User>({
		queryKey: ["getPrincipal"],
		queryFn: getPrincipal,
		retry: 1,
	});

	useEffect(() => {
		if (!!data) {
			setAuth(data);
		}
	}, [data]);

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

import LocationSearchBar from "@/components/LocationSearchBar";
import { useLocationStore } from "@/stores/useLocationStore";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function SelectLocation() {
	const router = useRouter();

	return (
		<View style={styles.wrapper}>
			<Text style={styles.description}>
				검색창에서 위치를 입력하고 선택해주세요.
			</Text>

			<View style={styles.searchBarContainer}>
				<LocationSearchBar
					placeholderText="예: 서울, 뉴욕, 파리..."
					onLocationSelect={(lat, lng) => {
						useLocationStore
							.getState()
							.setLocation(lat.toString(), lng.toString());
						router.back();
					}}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 20,
		paddingTop: 60,
	},

	description: {
		fontSize: 16,
		color: "#666",
		marginBottom: 30,
	},
	searchBarContainer: {
		zIndex: 10,
		display: "flex",
	},
});

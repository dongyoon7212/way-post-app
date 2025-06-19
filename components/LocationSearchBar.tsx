// components/LocationSearchBar.tsx
import { StyleSheet, View } from "react-native";
import GooglePlacesTextInput from "react-native-google-places-textinput";

type Props = {
	onLocationSelect: (lat: number, lng: number) => void;
};

export default function LocationSearchBar({ onLocationSelect }: Props) {
	const getPlaceDetails = async (placeId: string) => {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
		);
		const data = await response.json();
		const location = data.result.geometry.location; // ✅ 위도·경도 포함

		return {
			lat: location.lat,
			lng: location.lng,
			name: data.result.name,
		};
	};

	return (
		<View style={styles.container}>
			<GooglePlacesTextInput
				apiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!}
				onPlaceSelect={async (place: any) => {
					const placeId = place.placeId;

					try {
						const details = await getPlaceDetails(placeId);
						onLocationSelect(details.lat, details.lng);
					} catch (err) {
						console.warn("위치 정보를 불러오지 못했습니다.", err);
					}
				}}
				minCharsToFetch={1}
				placeHolderText="어디로 떠나시나요?"
				languageCode="ko"
				showLoadingIndicator={true}
				showClearButton={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		right: 55,
		top: 15,
		left: 0,
		// elevation: 20,
		// shadowColor: "#000",
		// shadowOffset: { width: 0, height: 1 },
		// shadowOpacity: 0.2,
		// shadowRadius: 3,
	},
});

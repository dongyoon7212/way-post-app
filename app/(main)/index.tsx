import LocationSearchBar from "@/components/LocationSearchBar";
import MapLoadingLottie from "@/components/MapLoadingLottie";
import { useAuthStore } from "@/stores/useAuthStore";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { getPrincipal } from "../../api/apis/authApi";

export default function HomeScreen() {
	const { setAuth } = useAuthStore();
	const [isMapReady, setIsMapReady] = useState(false);
	const [isPostLoaded, setIsPostLoaded] = useState(false); // 이후 게시물 불러올 때 사용 예정
	const [region, setRegion] = useState<Region>();
	const mapRef = useRef<MapView>(null);

	const handleLocationSelect = (lat: number, lng: number) => {
		console.log(lat, lng);
		mapRef.current?.animateToRegion(
			{
				latitude: lat,
				longitude: lng,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			},
			500 // 애니메이션 지속시간(ms)
		);
	};

	const { data, isLoading } = useQuery<User>({
		queryKey: ["getPrincipal"],
		queryFn: getPrincipal,
		retry: 1,
	});

	const isMapLoading = !(isMapReady && isPostLoaded && isLoading);

	useEffect(() => {
		if (!!data) {
			setAuth(data);
		}
	}, [data]);

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				console.log("Permission to access location was denied");
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			const { latitude, longitude } = location.coords;

			setRegion({
				latitude,
				longitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			});
			setIsMapReady(false);
		})();
	}, []);

	return (
		<View style={styles.container}>
			{isMapLoading && <MapLoadingLottie />}
			<LocationSearchBar onLocationSelect={handleLocationSelect} />
			<MapView
				ref={mapRef}
				provider={PROVIDER_GOOGLE}
				style={styles.map}
				initialRegion={region}
				showsUserLocation={true}
				// onMapReady={() => setIsMapReady(true)}
			>
				{/* {region && <Marker coordinate={region} title="현재 위치" />} */}
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "relative",
	},
	map: {
		width: "100%",
		height: "100%",
	},
});

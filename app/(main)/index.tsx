import LocationSearchBar from "@/components/LocationSearchBar";
import MapLoadingLottie from "@/components/MapLoadingLottie";
import { useAuthStore } from "@/stores/useAuthStore";
import { User } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import {
	Animated,
	Easing,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { getPrincipal } from "../../api/apis/authApi";

export default function HomeScreen() {
	const [isMapReady, setIsMapReady] = useState(false);
	const [isPostLoaded, setIsPostLoaded] = useState(false); // 이후 게시물 불러올 때 사용 예정
	const [region, setRegion] = useState<Region>();
	const [showSearchBar, setShowSearchBar] = useState(false);
	const mapRef = useRef<MapView>(null);
	const [showActionOptions, setShowActionOptions] = useState(false);
	const lottieRef = useRef<LottieView>(null);
	const router = useRouter();

	const actionAnim = useRef(new Animated.Value(0)).current;

	const toggleActionOptions = () => {
		// lottieRef.current?.reset();
		lottieRef.current?.play();

		if (showActionOptions) {
			lottieRef.current?.play(70, 140);
			Animated.timing(actionAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start(() => setShowActionOptions(false));
		} else {
			lottieRef.current?.play(0, 70);
			setShowActionOptions(true);
			Animated.timing(actionAnim, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}).start();
		}
	};

	const searchBarAnim = useRef(new Animated.Value(0)).current;

	const handleLocationSelect = (lat: number, lng: number) => {
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
		retry: 2,
		refetchOnMount: "always",
	});

	const isMapLoading = !(isMapReady && isPostLoaded && isLoading);

	useEffect(() => {
		if (!!data) {
			useAuthStore.getState().setAuth(data);
		} else {
			SecureStore.deleteItemAsync("accessToken");
			useAuthStore.getState().clearAuth();
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

	const toggleSearchBar = () => {
		if (showSearchBar) {
			Animated.timing(searchBarAnim, {
				toValue: 0,
				duration: 100,
				easing: Easing.out(Easing.ease),
				useNativeDriver: true,
			}).start(() => {
				requestAnimationFrame(() => {
					setShowSearchBar(false);
				});
			});
		} else {
			setShowSearchBar(true); // 먼저 보이게 하고
			Animated.timing(searchBarAnim, {
				toValue: 1,
				duration: 100,
				easing: Easing.out(Easing.ease),
				useNativeDriver: true,
			}).start();
		}
	};

	const translateY = searchBarAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [-100, 0], // 위에서 아래로 슬라이드
	});

	const handleGoToCurrentLocation = async () => {
		try {
			let location = await Location.getCurrentPositionAsync({});
			const { latitude, longitude } = location.coords;

			setRegion({
				latitude,
				longitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			});

			mapRef.current?.animateToRegion(
				{
					latitude,
					longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				},
				500
			);
		} catch (err) {
			console.warn("위치 정보 가져오기 실패:", err);
		}
	};

	return (
		<View style={styles.container}>
			{isMapLoading && <MapLoadingLottie />}
			{/* 🔍 아이콘 */}
			<TouchableOpacity
				style={styles.searchIcon}
				onPress={toggleSearchBar}
			>
				<Ionicons name="search" size={24} color="black" />
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.currentLocationButton}
				onPress={handleGoToCurrentLocation}
			>
				<Ionicons name="locate" size={20} color="black" />
			</TouchableOpacity>
			{/* ➕ 메인 플로팅 버튼 */}
			<TouchableOpacity style={styles.fab} onPress={toggleActionOptions}>
				<LottieView
					ref={lottieRef}
					source={require("@/assets/lotties/menu.json")}
					autoPlay={false} // ✅ 수동 제어
					loop={false}
					style={styles.lottie}
				/>
			</TouchableOpacity>

			{/* 게시물 추가 */}
			{showActionOptions && (
				<TouchableOpacity
					style={[styles.fabOption, { bottom: 90 }]}
					onPress={() => {
						setShowActionOptions(false);
						router.push("/(main)/post/uploadPost"); // ← 게시물 작성 화면으로
					}}
				>
					<Text style={styles.fabOptionText}>게시물 추가</Text>
				</TouchableOpacity>
			)}

			{/* 일정 추가 */}
			{showActionOptions && (
				<TouchableOpacity
					style={[styles.fabOption, { bottom: 135 }]}
					onPress={() => {
						setShowActionOptions(false);
						// TODO: 일정 추가 화면 연결 예정
					}}
				>
					<Text style={styles.fabOptionText}>일정 추가</Text>
				</TouchableOpacity>
			)}

			{/* 📍 SearchBar 애니메이션 */}
			{showSearchBar && (
				<Animated.View
					style={[
						styles.searchBarContainer,
						{ transform: [{ translateY }] },
					]}
				>
					<LocationSearchBar
						onLocationSelect={handleLocationSelect}
					/>
				</Animated.View>
			)}
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
	searchIcon: {
		position: "absolute",
		top: 15,
		right: 15,
		zIndex: 10,
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "#dbdbdb",
		padding: 12,
		borderRadius: 30,
		elevation: 3,
	},
	searchBarContainer: {
		position: "absolute",
		left: 20,
		right: 20,
		zIndex: 9,
	},
	currentLocationButton: {
		position: "absolute",
		top: 75, // 🔍 버튼보다 약간 아래
		right: 19,
		zIndex: 10,
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "#dbdbdb",
		padding: 10,
		borderRadius: 30,
		elevation: 3,
	},
	fab: {
		position: "absolute",
		bottom: 30,
		right: 20,
		borderRadius: 30,
		backgroundColor: "white",
		width: 50,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		elevation: 5,
		zIndex: 10,
	},

	fabOption: {
		position: "absolute",
		right: 25,
		backgroundColor: "white",
		paddingVertical: 10,
		paddingHorizontal: 14,
		width: 95,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 12,
		elevation: 4,
		zIndex: 9,
	},

	fabOptionText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#333",
	},
	lottie: {
		width: 30,
		height: 30,
	},
});

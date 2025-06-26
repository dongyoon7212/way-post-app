import { uploadPhotoPost } from "@/api/apis/postApi";
import { storage } from "@/api/firebase/firebaseConfig";
import UploadingModal from "@/components/UploadingModal";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLocationStore } from "@/stores/useLocationStore";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import {
	Alert,
	Image,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import uuid from "react-native-uuid";

export default function UploadPostScreen() {
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [content, setContent] = useState("");
	const [cameraModel, setCameraModel] = useState("");
	const [location, setLocation] = useState("");
	const [imageFile, setImageFile] = useState<any>(null);
	const { principal } = useAuthStore();
	const [uploadState, setUploadState] = useState<
		"idle" | "uploading" | "done"
	>("idle");
	const router = useRouter();
	const { lat, lng } = useLocationStore();
	const uuidStr = uuid.v4();

	useEffect(() => {
		if (lat && lng) {
			(async () => {
				const address = await getAddressFromCoords(lat, lng);
				if (address) setLocation(address);
			})();
		}
	}, [lat, lng]);

	const handleSelectPhoto = () => {
		Alert.alert("사진 업로드", "어떻게 사진을 추가할까요?", [
			{ text: "카메라로 촬영", onPress: openCamera },
			{ text: "앨범에서 선택", onPress: openGallery },
			{ text: "취소", style: "cancel" },
		]);
	};

	const openCamera = async () => {
		const permission = await ImagePicker.requestCameraPermissionsAsync();
		if (permission.granted) {
			const result = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1,
				exif: true,
			});
			if (!result.canceled) {
				handleImageSelected(result.assets[0]);
			}
		} else {
			Alert.alert("권한이 필요합니다", "카메라 권한을 허용해주세요.");
		}
	};

	const openGallery = async () => {
		const permission =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permission.granted) {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1,
				exif: true,
			});
			if (!result.canceled) {
				handleImageSelected(result.assets[0]);
			}
		} else {
			Alert.alert("권한이 필요합니다", "앨범 접근 권한을 허용해주세요.");
		}
	};

	const handleImageSelected = async (asset: ImagePicker.ImagePickerAsset) => {
		setCameraModel("");
		setLocation("");
		setImageUri(asset.uri);
		setImageFile(asset);
		if (asset.exif) {
			setCameraModel(asset.exif.Model ?? "");
			if (asset.exif.GPSLatitude && asset.exif.GPSLongitude) {
				const address = await getAddressFromCoords(
					asset.exif.GPSLatitude,
					asset.exif.GPSLongitude
				);
				if (address) setLocation(address);
			}
		}
	};

	const getAddressFromCoords = async (
		lat: number,
		lng: number
	): Promise<string | null> => {
		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&language=ko`
			);
			const data = await response.json();

			if (data.status === "OK") {
				return data.results[0]?.formatted_address || null;
			} else {
				console.warn("Geocoding failed:", data.status);
				return null;
			}
		} catch (err) {
			console.error("Geocoding error:", err);
			return null;
		}
	};

	const handleUpload = async () => {
		if (!imageUri || !imageFile) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Alert.alert("이미지를 먼저 선택해 주세요");
			return;
		}
		if (!content.trim()) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Alert.alert("내용을 입력해 주세요");
			return;
		}
		if (!cameraModel.trim()) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Alert.alert("카메라 모델을 입력해 주세요");
			return;
		}
		if (!location.trim()) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Alert.alert("위치를 입력해 주세요");
			return;
		}
		try {
			setUploadState("uploading");
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			const response = await fetch(imageUri);
			const blob = await response.blob();
			const fileName = `post-img/${uuidStr}.jpg`;
			const imageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(imageRef, blob);

			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					setUploadState("idle");
					Alert.alert("업로드 실패", error.message);
				},
				async () => {
					const url = await getDownloadURL(uploadTask.snapshot.ref);
					uploadPhotoPost({
						userId: principal?.userId,
						postText: content,
						imgUrl: url,
						cameraModel: cameraModel,
						locationAddress: location,
						latitude: lat,
						longitude: lng,
					})
						.then((response) => {
							const typedResponse = response as {
								status: number;
							};
							if (typedResponse.status === 200) {
								Haptics.notificationAsync(
									Haptics.NotificationFeedbackType.Success
								);
								setUploadState("done");
								setTimeout(() => {
									setUploadState("idle");
									router.replace("/(main)");
								}, 2000);
							}
						})
						.catch((error) => {
							setUploadState("idle");
							Alert.alert(
								"오류",
								"업로드 중 문제가 발생했습니다"
							);
							router.replace("/(main)");
						});
				}
			);
		} catch (err: any) {
			setUploadState("idle");
			console.error("이미지 업로드 실패:", err);
			Alert.alert("오류", "업로드 중 문제가 발생했습니다");
		}
	};

	return (
		<View style={styles.wrapper}>
			<UploadingModal
				visible={uploadState !== "idle"}
				type={uploadState}
			/>

			<KeyboardAwareScrollView
				contentContainerStyle={styles.container}
				enableOnAndroid
				extraScrollHeight={100}
				keyboardShouldPersistTaps="handled"
			>
				<TouchableOpacity
					style={styles.imageBox}
					onPress={handleSelectPhoto}
				>
					{imageUri ? (
						<Image
							source={{ uri: imageUri }}
							style={styles.image}
						/>
					) : (
						<Feather name="camera" size={32} color="#888" />
					)}
				</TouchableOpacity>

				<TextInput
					style={[styles.input, styles.textarea]}
					placeholder="내용을 작성하세요"
					multiline
					value={content}
					onChangeText={setContent}
				/>

				<TextInput
					style={[styles.input, cameraModel ? styles.readonly : null]}
					placeholder="카메라 모델 입력"
					value={cameraModel}
					onChangeText={setCameraModel}
					editable={!cameraModel}
				/>

				{location ? (
					<View style={[styles.input, styles.readonly]}>
						<Text style={{ color: "#444" }}>{location}</Text>
					</View>
				) : (
					<TouchableOpacity
						style={styles.searchLocationBtn}
						onPress={() =>
							router.push("/(main)/post/selectLocation")
						}
					>
						<Text style={{ color: "#1E90FF", fontSize: 16 }}>
							📍 위치 검색하기
						</Text>
					</TouchableOpacity>
				)}

				<View style={{ height: 120 }} />
			</KeyboardAwareScrollView>

			<View style={styles.fixedButtonContainer}>
				<TouchableOpacity
					style={styles.submitButton}
					onPress={handleUpload}
				>
					<Text style={styles.submitText}>등록</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: "#fff",
	},
	container: {
		padding: 20,
	},
	imageBox: {
		width: "100%",
		aspectRatio: 1,
		backgroundColor: "#f0f0f0",
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 12,
	},
	input: {
		backgroundColor: "#f5f5f5",
		borderRadius: 10,
		padding: 14,
		fontSize: 16,
		marginBottom: 15,
	},
	readonly: {
		backgroundColor: "#eee",
		color: "#666",
	},
	textarea: {
		height: 120,
		textAlignVertical: "top",
	},
	fixedButtonContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: Platform.OS === "ios" ? 30 : 20,
		backgroundColor: "#fff",
		borderTopWidth: 1,
		borderColor: "#ddd",
	},
	searchLocationBtn: {
		marginBottom: 15,
		padding: 14,
		borderRadius: 10,
		backgroundColor: "#f5f5f5",
		alignItems: "center",
		justifyContent: "center",
	},
	submitButton: {
		backgroundColor: "#1E90FF",
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: "center",
	},
	submitText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
});

import { useLocationStore } from "@/stores/useLocationStore";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	Image,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function UploadPostScreen() {
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [content, setContent] = useState("");
	const [cameraModel, setCameraModel] = useState("");
	const [location, setLocation] = useState("");
	const router = useRouter();
	const { lat, lng } = useLocationStore();

	useEffect(() => {
		setLocation(`${lat}${lng}`);
	}, [lat, lng]);

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 1,
			exif: true,
		});

		if (!result.canceled) {
			setCameraModel("");
			setLocation("");
			const asset = result.assets[0];
			setImageUri(asset.uri);
			if (asset.exif) {
				setCameraModel(asset.exif.Model ?? "");
				if (asset.exif.GPSLatitude && asset.exif.GPSLongitude) {
					const lat = asset.exif.GPSLatitude;
					const lng = asset.exif.GPSLongitude;
					setLocation(`${lat}${lng}`);
				}
			}
		}
	};

	return (
		<View style={styles.wrapper}>
			<KeyboardAwareScrollView
				contentContainerStyle={styles.container}
				enableOnAndroid
				extraScrollHeight={100}
				keyboardShouldPersistTaps="handled"
			>
				{/* 사진 업로드 */}
				<TouchableOpacity style={styles.imageBox} onPress={pickImage}>
					{imageUri ? (
						<Image
							source={{ uri: imageUri }}
							style={styles.image}
						/>
					) : (
						<Feather name="camera" size={32} color="#888" />
					)}
				</TouchableOpacity>

				{/* 본문 */}
				<TextInput
					style={[styles.input, styles.textarea]}
					placeholder="내용을 작성하세요"
					multiline
					value={content}
					onChangeText={setContent}
				/>

				{/* 카메라 모델 */}
				<TextInput
					style={[styles.input, cameraModel ? styles.readonly : null]}
					placeholder="카메라 모델 입력"
					value={cameraModel}
					onChangeText={setCameraModel}
					editable={!cameraModel}
				/>

				{/* 위치 정보 텍스트 */}
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

			{/* 등록 버튼 고정 */}
			<View style={styles.fixedButtonContainer}>
				<TouchableOpacity style={styles.submitButton}>
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

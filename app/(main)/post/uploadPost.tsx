import LocationSearchBar from "@/components/LocationSearchBar"; // 재사용
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function UploadPostScreen() {
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [content, setContent] = useState("");
	const [cameraModel, setCameraModel] = useState("");
	const [location, setLocation] = useState("");

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
					setLocation(`${lat}, ${lng}`);
				}
			}
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			{/* 제목 */}
			<Text style={styles.header}>게시물 작성</Text>

			{/* 사진 업로드 */}
			<TouchableOpacity style={styles.imageBox} onPress={pickImage}>
				{imageUri ? (
					<Image source={{ uri: imageUri }} style={styles.image} />
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

			{cameraModel ? (
				<TextInput
					style={[
						styles.input,
						{ backgroundColor: "#eee", color: "#666" },
					]}
					value={cameraModel}
					editable={false}
				/>
			) : (
				<TextInput
					style={styles.input}
					placeholder="카메라 모델 입력"
					value={cameraModel}
					onChangeText={setCameraModel}
				/>
			)}

			{location ? (
				<View style={styles.input}>
					<Text style={{ color: "#444" }}>{location}</Text>
				</View>
			) : (
				<View style={{ marginVertical: 10 }}>
					<Text style={{ marginBottom: 5, color: "#444" }}>
						위치 선택
					</Text>
					<LocationSearchBar
						onLocationSelect={(lat, lng) =>
							setLocation(`${lat}, ${lng}`)
						}
					/>
				</View>
			)}

			{/* 등록 버튼 */}
			<TouchableOpacity style={styles.submitButton}>
				<Text style={styles.submitText}>등록</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "#fff",
	},
	header: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 20,
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
	textarea: {
		height: 120,
		textAlignVertical: "top",
	},
	submitButton: {
		backgroundColor: "#1E90FF",
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 20,
	},
	submitText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
});

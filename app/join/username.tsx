import { usernameDuplChkRequest } from "@/api/apis/authApi";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

export default function UsernameScreen() {
	const { email } = useLocalSearchParams<{ email: string }>();
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleNext = () => {
		if (!username.trim()) {
			return;
		}

		usernameDuplChkRequest(username)
			.then((response) => {
				if (response.status === 200) {
					if (response.data === 0) {
						setError("");
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
						router.push({
							pathname: "/join/password",
							params: { email, username },
						});
					} else {
						setError("이미 사용중인 이름입니다.");
					}
				}
			})
			.catch((error) => {
				if (error.response.status === 400) {
					alert("문제가 발생했습니다. 다시 시도해 주세요.");
				}
			});
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<View style={styles.stepIndicator}>
				<Text style={styles.stepText}>2 / 3</Text>
			</View>

			<View style={styles.content}>
				<Text style={styles.title}>
					좋은 닉네임은 여행을 더 즐겁게 해줘요
				</Text>
				<Text style={styles.subtitle}>
					사용하실 닉네임을 입력해주세요
				</Text>

				<TextInput
					style={[styles.input, error && { borderColor: "#f00" }]}
					placeholder="닉네임"
					value={username}
					onChangeText={setUsername}
					placeholderTextColor="#aaa"
				/>
				{error ? <Text style={styles.errorText}>{error}</Text> : null}

				<Pressable
					style={[
						styles.nextButton,
						!username && { backgroundColor: "#ccc" },
					]}
					onPress={handleNext}
				>
					<Text style={styles.nextButtonText}>다음</Text>
				</Pressable>

				<Pressable
					style={styles.backContainer}
					onPress={() => router.back()}
				>
					<Text style={styles.backText}>← 이전으로</Text>
				</Pressable>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 24,
		backgroundColor: "#fff",
		justifyContent: "center",
	},
	stepIndicator: {
		position: "absolute",
		top: 70,
		right: 30,
	},
	stepText: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#666",
	},
	content: {
		gap: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#111",
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		color: "#000",
	},
	errorText: {
		color: "#f00",
		fontSize: 14,
		marginLeft: 14,
	},
	nextButton: {
		backgroundColor: "#1E90FF",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		marginTop: 8,
	},
	nextButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	backContainer: {
		marginTop: 20,
		alignItems: "center",
	},
	backText: {
		color: "#888",
		fontSize: 14,
	},
});

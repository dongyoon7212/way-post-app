import { signupRequest } from "@/api/apis/authApi";
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

export default function PasswordScreen() {
	const { email, username } = useLocalSearchParams<{
		email: string;
		username: string;
	}>();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async () => {
		if (!password || !confirmPassword) {
			setError("비밀번호를 모두 입력해주세요.");
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
			return;
		}
		if (password !== confirmPassword) {
			setError("비밀번호가 일치하지 않습니다.");
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
			return;
		}
		setError("");
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

		// 🔐 TODO: API 연동 가능
		console.log("회원가입:", { email, username, password });
		try {
			const result = await signupRequest({
				email,
				username,
				password,
				passwordConfirm: confirmPassword,
			});
			console.log("✅ 회원가입 성공", result);
			if (result.status === 200) {
				router.replace("/join/success");
			}
		} catch (err) {
			console.error("❌ 회원가입 실패", err);
			setError("회원가입에 실패했습니다.");
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<View style={styles.stepIndicator}>
				<Text style={styles.stepText}>3 / 3</Text>
			</View>

			<View style={styles.content}>
				<Text style={styles.title}>거의 다 왔어요!</Text>
				<Text style={styles.subtitle}>
					안전한 비밀번호를 입력해주세요
				</Text>

				<TextInput
					style={[styles.input, error && { borderColor: "#f00" }]}
					placeholder="비밀번호"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
					placeholderTextColor="#aaa"
				/>

				<TextInput
					style={[styles.input, error && { borderColor: "#f00" }]}
					placeholder="비밀번호 확인"
					secureTextEntry
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					placeholderTextColor="#aaa"
				/>

				{error ? <Text style={styles.errorText}>{error}</Text> : null}

				<Pressable
					style={[
						styles.submitButton,
						(!password || !confirmPassword) && {
							backgroundColor: "#ccc",
						},
					]}
					onPress={handleSubmit}
				>
					<Text style={styles.submitButtonText}>회원가입</Text>
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
		fontSize: 26,
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
		marginTop: -10,
	},
	submitButton: {
		backgroundColor: "#1E90FF",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		marginTop: 8,
	},
	submitButtonText: {
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

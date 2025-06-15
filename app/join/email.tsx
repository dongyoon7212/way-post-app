import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
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

export default function EmailScreen() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const validateAndNext = () => {
		if (!email) {
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("유효한 이메일을 입력해주세요.");
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
			return;
		}
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		setError("");
		router.push({
			pathname: "/join/username",
			params: { email },
		});
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<View style={styles.stepIndicator}>
				<Text style={styles.stepText}>1 / 3</Text>
			</View>

			<View style={styles.content}>
				<Text style={styles.title}>가입을 시작해볼까요?</Text>
				<Text style={styles.subtitle}>이메일을 입력해주세요</Text>

				<TextInput
					style={[styles.input, error && { borderColor: "#f00" }]}
					placeholder="example@email.com"
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
					keyboardType="email-address"
					placeholderTextColor="#aaa"
				/>

				{error ? <Text style={styles.errorText}>{error}</Text> : null}

				<Pressable
					style={[
						styles.nextButton,
						!email && { backgroundColor: "#ccc" },
					]}
					onPress={validateAndNext}
				>
					<Text style={styles.nextButtonText}>다음</Text>
				</Pressable>

				<View style={styles.backContainer}>
					<Text style={styles.backText} onPress={() => router.back()}>
						← 이전으로
					</Text>
				</View>
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
		fontSize: 28,
		fontWeight: "bold",
		color: "#111",
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		marginBottom: 12,
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

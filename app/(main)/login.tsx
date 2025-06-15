import { signinRequest } from "@/api/apis/authApi";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{}
	);
	const router = useRouter();

	const validate = () => {
		let valid = true;
		let errs: { email?: string; password?: string } = {};

		if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			errs.email = "유효한 이메일 주소를 입력하세요.";
			valid = false;
		} else if (password === "") {
			errs.password = "비밀번호를 입력하세요.";
			valid = false;
		}
		setErrors(errs);
		return valid;
	};

	const handleLogin = () => {
		if (validate()) {
			signinRequest({
				email: email,
				password: password,
			})
				.then((response) => {
					if (response.status === 200) {
						if (!response.data.accessToken) {
							Alert.alert(
								"알림",
								"사용자 정보가 알맞지 않습니다.",
								[{ text: "확인" }]
							);
							Haptics.notificationAsync(
								Haptics.NotificationFeedbackType.Error
							);
							return;
						}
				
						SecureStore.setItemAsync(
							"accessToken",
							response.data.accessToken
						);
						router.replace("/(main)");
					}
				})
				.catch((error) => {
					if (error.status !== 200) {
						alert("문제가 발생했습니다. 다시 시도해 주세요.");
					}
				});
		}
	};

	const renderInput = (
		type: "email" | "password",
		iconName: keyof typeof Ionicons.glyphMap,
		placeholder: string,
		value: string,
		setValue: (val: string) => void,
		secure?: boolean
	) => {
		const hasError =
			(type === "email" && !!errors.email) ||
			(type === "password" && !!errors.password);

		const errorMessage = type === "email" ? errors.email : errors.password;

		return (
			<View style={styles.inputWrapper}>
				<View
					style={[styles.inputField, hasError && styles.inputError]}
				>
					<Ionicons
						name={iconName}
						size={20}
						color={hasError ? "#f00" : "#999"}
						style={{ marginRight: 8 }}
					/>
					<TextInput
						value={value}
						onChangeText={setValue}
						secureTextEntry={secure}
						autoCapitalize="none"
						placeholder={placeholder}
						placeholderTextColor="#aaa"
						style={styles.textInput}
					/>
				</View>
				{hasError && (
					<Text style={styles.errorText}>{errorMessage}</Text>
				)}
			</View>
		);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<View style={styles.textContainer}>
				<Text style={styles.title}>WayPost</Text>
				<Text style={styles.subtitle}>
					로그인하고 여행을 공유해보세요
				</Text>
			</View>

			<View style={styles.inputContainer}>
				{renderInput(
					"email",
					"mail-outline",
					"이메일",
					email,
					setEmail
				)}
				{renderInput(
					"password",
					"lock-closed-outline",
					"비밀번호",
					password,
					setPassword,
					true
				)}
			</View>

			<Pressable style={styles.loginButton} onPress={handleLogin}>
				<Text style={styles.loginButtonText}>로그인</Text>
			</Pressable>

			<Pressable
				style={styles.signupButton}
				onPress={() => router.push("/join/email")}
			>
				<Text style={styles.signupButtonText}>회원가입</Text>
			</Pressable>

			<View style={styles.divider} />

			<Pressable
				style={[styles.socialButton, { backgroundColor: "#FEE500" }]}
			>
				<Text style={styles.socialText}>카카오로 로그인</Text>
			</Pressable>

			<Pressable
				style={[styles.socialButton, { backgroundColor: "#03C75A" }]}
			>
				<Text style={styles.socialText}>네이버로 로그인</Text>
			</Pressable>

			<Pressable
				style={[
					styles.socialButton,
					{
						backgroundColor: "#fff",
						borderWidth: 1,
						borderColor: "#ddd",
					},
				]}
			>
				<Text style={[styles.socialText, { color: "#000" }]}>
					Google로 로그인
				</Text>
			</Pressable>
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
	textContainer: {
		marginBottom: 40,
	},
	title: {
		fontSize: 50,
		fontWeight: "bold",
		color: "#111",
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		marginTop: 8,
	},
	inputContainer: {
		marginBottom: 24,
	},
	inputWrapper: {
		marginBottom: 16,
	},
	inputField: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: "#fff",
	},
	inputError: {
		borderColor: "#f00",
	},
	textInput: {
		flex: 1,
		paddingVertical: 4,
		fontSize: 16,
		color: "#000",
	},
	errorText: {
		color: "#f00",
		fontSize: 14, // 기존보다 확대
		marginTop: 6,
		marginLeft: 4,
	},
	loginButton: {
		backgroundColor: "#1E90FF",
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		marginBottom: 24,
	},
	loginButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	signupButton: {
		alignItems: "center",
		marginBottom: 24,
	},
	signupButtonText: {
		color: "#1E90FF",
		fontSize: 14,
	},
	divider: {
		height: 1,
		backgroundColor: "#eee",
		marginBottom: 24,
	},
	socialButton: {
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		marginBottom: 12,
	},
	socialText: {
		color: "#000",
		fontSize: 15,
		fontWeight: "500",
	},
});

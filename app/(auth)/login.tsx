import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleLogin = () => {
		// TODO: 로그인 API 연동 후 성공 시 홈으로 이동
		console.log("로그인 시도:", email, password);
		router.replace("/(main)"); // 로그인 성공 시 홈으로 이동
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>로그인</Text>
			<TextInput
				placeholder="이메일"
				value={email}
				onChangeText={setEmail}
				style={styles.input}
				autoCapitalize="none"
			/>
			<TextInput
				placeholder="비밀번호"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={styles.input}
			/>
			<Button title="로그인" onPress={handleLogin} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 24,
		textAlign: "center",
	},
	input: {
		height: 48,
		borderColor: "#ccc",
		borderWidth: 1,
		paddingHorizontal: 12,
		marginBottom: 16,
		borderRadius: 6,
	},
});

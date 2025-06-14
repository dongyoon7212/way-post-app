import { Redirect } from "expo-router";

export default function login() {
	return <Redirect href="/(auth)/login" />;
}

import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";

export default function BackBtn() {
	const router = useRouter();

	return (
		<Pressable style={styles.button} onPress={() => router.back()}>
			<ChevronLeft color="black" size={30} />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: { padding: 10 },
});

import { StyleSheet, Text, View } from "react-native";

export default function StepHeader({ step }: { step: number }) {
	const steps = ["1 / 3", "2 / 3", "3 / 3"];
	return (
		<View style={styles.container}>
			<Text style={styles.stepText}>{steps[step - 1]}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 70,
		right: 44,
	},
	stepText: {
		fontSize: 20,
		color: "#666",
	},
});

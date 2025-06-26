import LottieView from "lottie-react-native";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";

interface Props {
	visible: boolean;
	type?: String;
}

export default function UploadingModal({ visible, type }: Props) {
	return (
		<Modal transparent animationType="fade" visible={visible}>
			<View style={styles.overlay}>
				<LottieView
					source={
						type === "uploading"
							? require("@/assets/lotties/uploading.json")
							: require("@/assets/lotties/success.json")
					}
					autoPlay
					loop={type === "uploading"}
					style={{ width: 200, height: 200 }}
				/>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
});

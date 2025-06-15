// components/PostGridItem.tsx
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import PostSkeleton from "./PostSkeleton";

type Props = {
	uri: string;
	size: number;
};

export default function PostGridItem({ uri, size }: Props) {
	const [loaded, setLoaded] = useState(false);

	return (
		<View
			style={{
				width: size,
				height: size,
				marginRight: 1,
				marginBottom: 1,
			}}
		>
			{!loaded && <PostSkeleton size={size} />}
			<Image
				source={{ uri }}
				style={[
					StyleSheet.absoluteFillObject,
					{ width: size, height: size },
				]}
				onLoadEnd={() => setLoaded(true)}
			/>
		</View>
	);
}

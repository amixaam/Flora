import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

const AlbumArt = ({
    image,
    width,
    height,
    borderRadius,
    aspectRatio,
    position,
}) => {
    const styles = StyleSheet.create({
        AlbumContainer: {},
    });

    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;
    if (borderRadius) style.borderRadius = borderRadius;
    if (aspectRatio) style.aspectRatio = aspectRatio;
    if (position) style.position = position;

    if (image) {
        return (
            <Animated.Image
                sharedTransitionTag={image}
                source={{ uri: image }}
                style={[style]}
            />
        );
    } else {
        return (
            <LinearGradient
                colors={["pink", "lightblue"]}
                start={{ x: -0.5, y: 0 }}
                end={{ x: 1, y: 1.5 }}
                style={[style]}
            />
        );
    }
};

export default AlbumArt;

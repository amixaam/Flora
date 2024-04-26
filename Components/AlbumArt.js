import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";

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

    return (
        <View style={[[style], { elevation: 10 }]}>
            <Image
                source={
                    image
                        ? { uri: image }
                        : require("../assets/empty-cover.png")
                }
                style={[style, { flex: 1 }]}
            />
        </View>
    );
};

export default AlbumArt;

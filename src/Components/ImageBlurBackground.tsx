import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, StyleProp, View, ViewStyle } from "react-native";

interface ImageBlurBackgroundProps {
    image?: string;
    style?: StyleProp<ViewStyle>;
    gradientColors?: string[];
}

const ImageBlurBackground = ({
    image,
    style,
    gradientColors = [
        "#050506",
        "#05050699",
        "#05050655",
        "#05050699",
        "#050506",
    ],
}: ImageBlurBackgroundProps) => {
    const backup = require("../../assets/images/empty-cover.png");

    return (
        <View
            style={[
                {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    flex: 1,
                },
                style,
            ]}
        >
            <View
                style={{
                    position: "relative",
                    height: "100%",
                    flex: 1,
                }}
            >
                <ImageBackground
                    source={image ? { uri: image } : backup}
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        opacity: 0.8,
                    }}
                    resizeMode="stretch"
                    blurRadius={30}
                />
                <LinearGradient
                    colors={gradientColors}
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                    }}
                />
            </View>
        </View>
    );
};

export default ImageBlurBackground;

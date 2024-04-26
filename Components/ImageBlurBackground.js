import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, View } from "react-native";

const ImageBlurBackground = ({ image, styles }) => {
    const url = image ? { uri: image } : require("../assets/empty-cover.png");

    return (
        <View
            style={[
                {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    flex: 1,
                },
                styles,
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
                    source={url}
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
                    colors={[
                        "#050506",
                        "#05050666",
                        "#05050655",
                        "#05050699",
                        "#050506",
                    ]}
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

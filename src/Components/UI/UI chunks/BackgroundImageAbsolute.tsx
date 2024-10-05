import React from "react";
import { ImageBackground } from "react-native";

const BackgroundImageAbsolute = () => {
    return (
        <ImageBackground
            source={require("../../../../assets/images/indexBlur.png")}
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                opacity: 0.25,
            }}
        />
    );
};

export default BackgroundImageAbsolute;

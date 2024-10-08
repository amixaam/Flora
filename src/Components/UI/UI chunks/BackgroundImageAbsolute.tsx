import React from "react";
import { ImageBackground } from "react-native";
import { ImageSources } from "../../../styles/constants";

const BackgroundImageAbsolute = () => {
    return (
        <ImageBackground
            source={ImageSources.AppBackground}
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

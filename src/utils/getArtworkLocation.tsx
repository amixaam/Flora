import { ImageSourcePropType } from "react-native";

export const getArtworkLocation = (fileUri: string | undefined) => {
    let uri: ImageSourcePropType = require("../../assets/images/empty-cover.png");

    if (fileUri === "Liked songs") {
        uri = require("../../assets/images/liked-songs-cover.png");
    } else if (fileUri) {
        uri = { uri: fileUri };
    }

    return uri;
};

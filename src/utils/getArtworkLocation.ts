import { ImageSourcePropType } from "react-native";
import { ImageSources } from "../styles/constants";

export const getArtworkLocation = (image: string | undefined) => {
    let uri: ImageSourcePropType = ImageSources.cover;

    if (image === "Liked songs") {
        uri = ImageSources.likedSongsCover;
    } else if (image) {
        if (image.startsWith("file:///")) {
            uri = { uri: image };
        } else {
            uri = { uri: `data:image/jpeg;base64,${image}` };
        }
    }

    return uri;
};

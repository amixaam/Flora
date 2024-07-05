import { Image, StyleProp, View, ViewStyle } from "react-native";
import { Album, Playlist } from "../types/song";
import { Spacing } from "../styles/constants";

type AlbumArtProps = {
    style: StyleProp<ViewStyle>;
    image: Playlist["artwork"] | Album["artwork"];
};

const AlbumArt = ({ image, style }: AlbumArtProps) => {
    const source = image
        ? { uri: image }
        : require("../../assets/images/empty-cover.png");

    return (
        <View style={[style, { aspectRatio: 1, borderRadius: Spacing.radius }]}>
            <Image
                source={source}
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: Spacing.radius,
                }}
            />
        </View>
    );
};

export default AlbumArt;

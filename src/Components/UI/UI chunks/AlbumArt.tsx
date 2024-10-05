import { Image, StyleProp, View, ViewStyle } from "react-native";
import { Album, Playlist } from "../../../types/song";
import { Spacing } from "../../../styles/constants";
import { getArtworkLocation } from "../../../utils/getArtworkLocation";

type AlbumArtProps = {
    style?: StyleProp<ViewStyle>;
    radius?: Spacing;
    image?: Playlist["artwork"] | Album["artwork"];
};

const AlbumArt = ({ image, radius = Spacing.radius, style }: AlbumArtProps) => {

    return (
        <View style={[style, { aspectRatio: 1, borderRadius: radius }]}>
            <Image
                source={getArtworkLocation(image)}
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: radius,
                }}
            />
        </View>
    );
};

export default AlbumArt;

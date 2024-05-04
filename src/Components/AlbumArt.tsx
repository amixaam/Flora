import { ImageStyle, StyleProp } from "react-native";
import { Image, View } from "react-native";

const AlbumArt = ({
    image,
    style,
}: {
    image?: string;
    style?: StyleProp<ImageStyle>;
}) => {
    const backup = require("../../assets/images/empty-cover.png");

    return (
        <View style={[style, { elevation: 10 }]}>
            <Image
                source={image ? { uri: image } : backup}
                style={[{ flex: 1 }, style]}
            />
        </View>
    );
};

export default AlbumArt;

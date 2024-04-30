import { Image, View } from "react-native";

const AlbumArt = ({ image, style }) => {
    const url = image
        ? { uri: image }
        : require("../../assets/images/empty-cover.png");

    return (
        <View style={[style, { elevation: 10 }]}>
            <Image source={url} style={[style, { flex: 1 }]} />
        </View>
    );
};

export default AlbumArt;

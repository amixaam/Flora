import { Text, TouchableNativeFeedback, View } from "react-native";
import { Spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";
import { Album, Playlist } from "../../types/song";
import { CombineStrings } from "../../utils/CombineStrings";
import Pluralize from "../../utils/Pluralize";
import AlbumArt from "../AlbumArt";

type ContainerItemProps = {
    item: Playlist | Album;
    touchableProps?: React.ComponentProps<typeof TouchableNativeFeedback>;
};

const ContainerItem = ({ item, touchableProps = {} }: ContainerItemProps) => {
    const width = 160;
    return (
        <TouchableNativeFeedback delayLongPress={250} {...touchableProps}>
            <View style={{ gap: Spacing.xs, width: width }}>
                <AlbumArt image={item.artwork} style={{ width: width }} />
                <View>
                    <Text style={textStyles.h6} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text
                        style={[textStyles.small, { width: "100%" }]}
                        numberOfLines={1}
                    >
                        {/* Differentiate between albums and playlists */}
                        {"artist" in item
                            ? CombineStrings([item.artist, item.year])
                            : Pluralize(item.songs.length, "song", "songs")}
                    </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

export default ContainerItem;

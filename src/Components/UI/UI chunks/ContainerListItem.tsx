import { Text, TouchableNativeFeedback, View } from "react-native";
import { newStyles } from "../../../styles/styles";
import { Album, Playlist } from "../../../types/song";
import { IconButtonProps } from "../Headers/SheetHeader";
import AlbumArt from "./AlbumArt";
import { textStyles } from "../../../styles/text";
import { Spacing } from "../../../styles/constants";
import Pluralize from "../../../utils/Pluralize";
import { CombineStrings } from "../../../utils/CombineStrings";

interface ContainerListItemProps {
    container: Playlist | Album;
    options?: IconButtonProps | React.ReactElement;
    touchableNativeProps?: React.ComponentProps<typeof TouchableNativeFeedback>;
    viewProps?: React.ComponentProps<typeof View>;
}

const ContainerListItem = ({
    container,
    options,
    touchableNativeProps,
    viewProps,
}: ContainerListItemProps) => {
    return (
        <TouchableNativeFeedback {...touchableNativeProps}>
            <View style={newStyles.songListItem} {...viewProps}>
                <View
                    style={{
                        flexDirection: "row",
                        gap: Spacing.md,
                        alignItems: "center",
                    }}
                >
                    <AlbumArt image={container.artwork} style={{ width: 80 }} />
                    <View
                        style={{
                            flexDirection: "column",
                            justifyContent: "center",
                            flex: 1,
                            gap: Spacing.xs,
                        }}
                    >
                        <Text numberOfLines={1} style={[textStyles.text]}>
                            {container.title}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={[textStyles.small, { opacity: 0.75 }]}
                        >
                            {"artist" in container
                                ? CombineStrings([
                                      container.artist,
                                      container.year,
                                  ])
                                : Pluralize(
                                      container.songs.length,
                                      "song",
                                      "songs"
                                  )}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

export default ContainerListItem;

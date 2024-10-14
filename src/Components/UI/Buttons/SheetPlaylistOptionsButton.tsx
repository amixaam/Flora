import React from "react";
import { Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Playlist } from "../../../types/song";
import Pluralize from "../../../utils/Pluralize";
import AlbumArt from "../UI chunks/AlbumArt";

interface Props {
    playlist: Playlist;
    onPress: () => void;
    isSelected?: boolean;
    isDisabled?: boolean;
}

const SheetPlaylistOptionsButton = ({
    playlist,
    onPress,

    isSelected = false,
    isDisabled = false,
}: Props) => {
    return (
        <TouchableRipple onPress={onPress} disabled={isDisabled}>
            <View
                style={[
                    isDisabled ? mainStyles.hiddenListItem : {},
                    {
                        justifyContent: "space-between",
                        paddingHorizontal: Spacing.appPadding,
                        gap: Spacing.md,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: Spacing.sm,
                    },
                ]}
            >
                <AlbumArt
                    image={playlist.artwork}
                    style={{
                        width: 64,
                    }}
                />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flex: 1,
                        columnGap: Spacing.md,
                    }}
                >
                    <View style={{ gap: Spacing.xs, flex: 1 }}>
                        <Text numberOfLines={2} style={textStyles.text}>
                            {playlist.title}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={[textStyles.small, { opacity: 0.75 }]}
                        >
                            {Pluralize(playlist.songs.length, "song")}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableRipple>
    );
};

export default SheetPlaylistOptionsButton;

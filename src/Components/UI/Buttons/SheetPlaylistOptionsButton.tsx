import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import Checkbox from "./Checkbox";
import { Spacing } from "../../../styles/constants";
import { Playlist } from "../../../types/song";
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
        <TouchableNativeFeedback onPress={onPress} disabled={isDisabled}>
            <View
                style={[
                    mainStyles.textListItem,
                    isDisabled ? mainStyles.hiddenListItem : {},
                    { justifyContent: "space-between" },
                ]}
            >
                <AlbumArt
                    image={playlist.artwork}
                    style={{
                        width: 56,
                        aspectRatio: 1,
                        borderRadius: 5,
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
                    <View style={{ flexDirection: "column", flex: 1 }}>
                        <Text style={[textStyles.text]} numberOfLines={1}>
                            {playlist.title}
                        </Text>
                        <Text style={textStyles.small}>
                            {playlist.songs.length} songs
                        </Text>
                    </View>
                    <Checkbox isSelected={isSelected} />
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

export default SheetPlaylistOptionsButton;

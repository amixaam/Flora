import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import AlbumArt from "../AlbumArt";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";
import Checkbox from "./Checkbox";
import { Spacing } from "../../styles/constants";

const SheetPlaylistOptionsButton = ({
    data,
    onPress,

    isSelected = false,
    isDisabled = false,
}) => {
    return (
        <TouchableNativeFeedback
            onPress={() => onPress(data)}
            disabled={isDisabled}
        >
            <View
                style={[
                    mainStyles.textListItem,
                    isDisabled ? mainStyles.hiddenListItem : {},
                    { justifyContent: "space-between" },
                ]}
            >
                <AlbumArt
                    image={data.artwork}
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
                            {data.name}
                        </Text>
                        <Text style={textStyles.small}>
                            {data.songs.length} songs
                        </Text>
                    </View>
                    <Checkbox
                        onPress={() => onPress(data)}
                        isSelected={isSelected}
                    />
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

export default SheetPlaylistOptionsButton;

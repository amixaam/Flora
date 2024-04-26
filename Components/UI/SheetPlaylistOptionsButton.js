import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import AlbumArt from "../AlbumArt";
import { mainStyles, textStyles } from "../styles";

const SheetPlaylistOptionsButton = ({
    data,
    onPress = () => {
        console.log("Pressed!");
    },
    isDisabled = false,
}) => {
    return (
        <TouchableNativeFeedback
            onPress={() => onPress(data.id)}
            disabled={isDisabled}
        >
            <View
                style={[
                    mainStyles.textListItem,
                    isDisabled ? mainStyles.hiddenListItem : {},
                ]}
            >
                <AlbumArt
                    image={data.image}
                    style={{
                        width: 56,
                        aspectRatio: 1,
                        borderRadius: 5,
                    }}
                />
                <Text style={textStyles.text}>{data.name}</Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default SheetPlaylistOptionsButton;

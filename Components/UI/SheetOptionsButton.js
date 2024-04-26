import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { mainStyles, textStyles } from "../styles";

const SheetOptionsButton = ({
    icon = "arrow-right",
    buttonContent,
    onPress = () => {
        console.log("Pressed!");
    },
    isDisabled = false,
}) => {
    return (
        <TouchableNativeFeedback disabled={isDisabled} onPress={onPress}>
            <View
                style={[
                    mainStyles.textListItem,
                    isDisabled ? mainStyles.hiddenListItem : {},
                ]}
            >
                <MaterialCommunityIcons
                    name={icon}
                    size={16}
                    style={[mainStyles.color_text]}
                />
                <Text style={[textStyles.text]}>{buttonContent}</Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default SheetOptionsButton;

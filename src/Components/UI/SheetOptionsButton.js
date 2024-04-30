import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";
import { colors } from "../../styles/constants";
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
                    style={{ color: colors.primary }}
                />
                <Text style={[textStyles.text]}>{buttonContent}</Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default SheetOptionsButton;

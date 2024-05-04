import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";
import { Colors, DefaultIcon, IconSizes } from "../../styles/constants";

interface SheetOptionsButtonProps {
    icon?: string;
    buttonContent: React.ReactNode;
    onPress?: () => void;
    isDisabled?: boolean;
}

const SheetOptionsButton = ({
    icon = DefaultIcon,
    buttonContent,
    onPress = () => {},
    isDisabled = false,
}: SheetOptionsButtonProps) => {
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
                    size={IconSizes.sm}
                    style={{ color: Colors.primary }}
                />
                <Text style={[textStyles.text]}>{buttonContent}</Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default SheetOptionsButton;

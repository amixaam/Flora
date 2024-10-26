import React from "react";
import { Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
    Colors,
    DefaultIcon,
    IconSizes,
    Spacing,
} from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";

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
        <TouchableRipple
            testID={icon + "-sheet-options-button"}
            disabled={isDisabled}
            onPress={onPress}
        >
            <View
                style={[
                    mainStyles.textListItem,
                    isDisabled ? mainStyles.hiddenListItem : {},
                    {
                        paddingHorizontal: Spacing.appPadding,
                        gap: Spacing.md,
                    },
                ]}
            >
                <MaterialCommunityIcons
                    name={icon}
                    size={IconSizes.md}
                    style={{ color: Colors.primary }}
                />
                <Text style={[textStyles.text]}>{buttonContent}</Text>
            </View>
        </TouchableRipple>
    );
};

export default SheetOptionsButton;

import { View, Text, TouchableNativeFeedback } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { colors, iconSizes, spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";

const LargeOptionButton = ({
    icon = iconSizes.defaultIcon,
    text = "No text given",
    onPress = () => {
        console.log("Pressed!");
    },
    disabled = false,
}) => {
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                rowGap: spacing.xs,
                marginBottom: spacing.md,
            }}
        >
            <TouchableNativeFeedback onPress={onPress} disabled={disabled}>
                <View
                    style={{
                        width: "100%",
                        alignItems: "center",
                        borderRadius: spacing.radius,
                        padding: spacing.md,
                        backgroundColor: colors.input,
                        opacity: disabled ? 0.5 : 1,
                    }}
                >
                    <MaterialCommunityIcons
                        name={icon}
                        size={iconSizes.md}
                        color={colors.primary}
                    />
                </View>
            </TouchableNativeFeedback>
            <Text style={[textStyles.text, { opacity: disabled ? 0.5 : 1 }]}>
                {text}
            </Text>
        </View>
    );
};

export default LargeOptionButton;

import { View, Text, TouchableNativeFeedback } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import {
    Colors,
    DefaultIcon,
    IconSizes,
    Spacing,
} from "../../styles/constants";
import { textStyles } from "../../styles/text";

const LargeOptionButton = ({
    icon = DefaultIcon,
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
                gap: Spacing.sm,
            }}
        >
            <TouchableNativeFeedback onPress={onPress} disabled={disabled}>
                <View
                    style={{
                        width: "100%",
                        alignItems: "center",
                        borderRadius: Spacing.radius,
                        padding: Spacing.md,
                        backgroundColor: Colors.input,
                        opacity: disabled ? 0.5 : 1,
                    }}
                >
                    <MaterialCommunityIcons
                        name={icon}
                        size={IconSizes.md}
                        color={Colors.primary}
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

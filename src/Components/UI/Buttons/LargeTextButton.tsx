import React from "react";
import { Text, TouchableNativeFeedback, View } from "react-native";
import { Colors, Spacing } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";

const LargeTextButton = ({
    mainText = "XX",
    subText = "No text given",
    onPress = () => {
        console.log("Pressed!");
    },
    disabled = false,
    bgColor = Colors.input,
    textColor = Colors.primary,
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
                        padding: Spacing.sm,
                        paddingVertical: Spacing.md,

                        backgroundColor: bgColor,
                        opacity: disabled ? 0.5 : 1,
                    }}
                >
                    <Text
                        style={[
                            textStyles.h5,
                            {
                                opacity: disabled ? 0.5 : 1,
                                marginBottom: -8,
                                color: textColor,
                            },
                        ]}
                    >
                        {mainText}
                    </Text>
                </View>
            </TouchableNativeFeedback>
            <Text style={[textStyles.text, { opacity: disabled ? 0.5 : 1 }]}>
                {subText}
            </Text>
        </View>
    );
};

export default LargeTextButton;

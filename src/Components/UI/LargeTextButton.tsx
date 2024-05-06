import { View, Text, TouchableNativeFeedback } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { Colors, IconSizes, Spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";

const LargeTextButton = ({
    mainText = "XX",
    subText = "No text given",
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
                rowGap: Spacing.xs,
                marginBottom: Spacing.md,
            }}
        >
            <TouchableNativeFeedback onPress={onPress} disabled={disabled}>
                <View
                    style={{
                        width: "100%",
                        alignItems: "center",
                        borderRadius: Spacing.radius,
                        padding: Spacing.sm,

                        backgroundColor: Colors.input,
                        opacity: disabled ? 0.5 : 1,
                    }}
                >
                    <Text
                        style={[
                            textStyles.h3,
                            { opacity: disabled ? 0.5 : 1, marginBottom: -8 },
                        ]}
                    >
                        {mainText}
                    </Text>
                </View>
            </TouchableNativeFeedback>
            <Text style={[textStyles.h6, { opacity: disabled ? 0.5 : 1 }]}>
                {subText}
            </Text>
        </View>
    );
};

export default LargeTextButton;

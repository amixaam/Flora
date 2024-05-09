import { View, Text } from "react-native";
import React from "react";
import {
    Colors,
    DefaultIcon,
    IconSizes,
    Spacing,
} from "../../styles/constants";
import { textStyles } from "../../styles/text";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface SmallTitleBigTextProps {
    icon?: string;
    header?: string;
    text?: string;
}
const SmallTitleBigText = ({
    icon = DefaultIcon,
    header = "no header provided",
    text = "no text provided",
}: SmallTitleBigTextProps) => {
    return (
        <View
            style={[
                {
                    backgroundColor: Colors.input,
                    padding: Spacing.sm,
                    borderRadius: Spacing.radius,
                },
            ]}
        >
            <View
                style={{
                    flexDirection: "row",
                    gap: Spacing.sm,
                    alignItems: "center",
                }}
            >
                <MaterialCommunityIcons
                    name={icon}
                    size={IconSizes.md}
                    style={{ color: Colors.primary }}
                />
                <Text style={textStyles.text}>{header}</Text>
            </View>
            <Text style={textStyles.h5}>{text}</Text>
        </View>
    );
};

export default SmallTitleBigText;

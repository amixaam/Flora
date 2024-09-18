import React from "react";
import { Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors, DefaultIcon, IconSizes } from "../../styles/constants";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";

interface SmallTitleBigTextProps {
    icon?: string;
    header?: string;
    text?: string;
}
const SmallStatisticText = ({
    icon = DefaultIcon,
    text = "no text provided",
}: SmallTitleBigTextProps) => {
    return (
        <View style={mainStyles.textListItem}>
            <MaterialCommunityIcons
                name={icon}
                size={IconSizes.md}
                style={{ color: Colors.primary }}
            />
            <Text style={[textStyles.text]}>{text}</Text>
        </View>
    );
};

export default SmallStatisticText;

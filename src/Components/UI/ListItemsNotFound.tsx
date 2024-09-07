import { View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import {
    Colors,
    DefaultIcon,
    IconSizes,
    Spacing,
} from "../../styles/constants";
import { textStyles } from "../../styles/text";

const ListItemsNotFound = ({
    icon = DefaultIcon,
    text = "Items not found!",
}) => {
    return (
        <View
            style={{
                alignItems: "center",
                marginTop: Spacing.xl,
                gap: Spacing.sm,
            }}
        >
            <MaterialCommunityIcons
                name={icon}
                size={IconSizes.md}
                color={Colors.primary}
            />
            <Text style={textStyles.h6}>{text}</Text>
        </View>
    );
};

export default ListItemsNotFound;

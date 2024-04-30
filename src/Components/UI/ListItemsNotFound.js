import { View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { colors, iconSizes, spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";

const ListItemsNotFound = ({
    icon = "question",
    text = "Items not found!",
}) => {
    return (
        <View style={{ alignItems: "center", marginTop: spacing.xl }}>
            <MaterialCommunityIcons
                name={icon}
                size={iconSizes.md}
                color={colors.primary}
            />
            <Text style={textStyles.h6}>{text}</Text>
        </View>
    );
};

export default ListItemsNotFound;

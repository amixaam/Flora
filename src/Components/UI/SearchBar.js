import { View, Text } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { colors, iconSizes, spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";
import IconButton from "./IconButton";

const SearchBar = ({ style, value = "", setValue = () => {} }) => {
    return (
        <View
            style={[
                style,
                {
                    backgroundColor: colors.input60,
                    borderRadius: spacing.round,
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.md,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                },
            ]}
        >
            <TextInput
                cursorColor={colors.primary}
                placeholder="Search"
                placeholderTextColor={colors.primary90}
                style={[textStyles.h6, { flex: 1 }]}
                selectionColor={colors.primary90}
                value={value}
                onChangeText={setValue}
            />
            <IconButton icon="magnify" size={iconSizes.sm} />
        </View>
    );
};

export default SearchBar;

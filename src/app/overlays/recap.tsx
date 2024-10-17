import React from "react";
import SwipeDownScreen from "../../Components/UI/Utils/SwipeDownScreen";
import SheetHeader from "../../Components/UI/Headers/SheetHeader";
import { useSongsStore } from "../../store/songs";
import { Text } from "react-native-paper";
import { Colors, Spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";
import { ScrollView } from "react-native-gesture-handler";

const RecapScreen = () => {
    const { getRecapData, isRecapDue } = useSongsStore();

    return (
        <SwipeDownScreen>
            <SheetHeader title="Recap" />
            <ScrollView style={{ paddingHorizontal: Spacing.md }}>
                <Text style={[textStyles.h6, { marginBottom: Spacing.md }]}>
                    {isRecapDue() ? "Recap is due" : "Recap is not due"}
                </Text>
                <Text style={textStyles.text}>
                    {JSON.stringify(getRecapData(), null, 4)}
                </Text>
            </ScrollView>
        </SwipeDownScreen>
    );
};

export default RecapScreen;

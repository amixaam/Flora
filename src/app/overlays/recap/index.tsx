import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SegmentedButtons, Text } from "react-native-paper";
import SheetHeader from "../../../Components/UI/Headers/SheetHeader";
import SwipeDownScreen from "../../../Components/UI/Utils/SwipeDownScreen";
import { useRecapStore } from "../../../store/recapStore";
import { Colors, Spacing } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import { RECAP_PERIOD, RecapPeriodData } from "../../../types/recap";
import { router } from "expo-router";

const RecapScreen = () => {
    const {
        activePeriods,
        getActivePeriodsData,
        setActivePeriods,
        getClosestPeriodEndDate,
        getFinishedPeriods,
    } = useRecapStore();

    const [value, setValue] = useState<string[]>(activePeriods);

    const ChangeActivePeriod = (value: string[]) => {
        setActivePeriods(value as RECAP_PERIOD[]);
        setValue(value);
    };

    const finishedPeriods = getFinishedPeriods();
    const activePeriodsData = getActivePeriodsData();

    const selectedActivePeriod = activePeriodsData.DAILY as RecapPeriodData;

    return (
        <SwipeDownScreen>
            <SheetHeader title="Recaps" />
            <ScrollView style={{ paddingHorizontal: Spacing.md }}>
                <SegmentedButtons
                    value={value}
                    onValueChange={ChangeActivePeriod}
                    multiSelect={true}
                    theme={{
                        colors: {
                            primary: Colors.primary,
                            onSurface: Colors.primary,
                            onSecondaryContainer: Colors.primary,
                            secondaryContainer: Colors.input,
                        },
                    }}
                    buttons={Object.values(RECAP_PERIOD).map((period) => ({
                        value: period as string,
                        label: period.charAt(0) + period.slice(1).toLowerCase(),
                    }))}
                />
                <View
                    style={{
                        marginTop: Spacing.xs,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={textStyles.tip}>
                        Select the frequency of Recaps
                    </Text>
                    <Text style={textStyles.tip}>
                        {`Next Recap ${
                            getClosestPeriodEndDate()?.humanReadable
                        }`}
                    </Text>
                </View>
                <Pressable
                    onPress={() => {
                        router.push(
                            `./recap/${
                                selectedActivePeriod.endDate.split("T")[0]
                            }?period=${RECAP_PERIOD.DAILY}`
                        );
                    }}
                    style={{
                        paddingVertical: Spacing.xl,
                        marginVertical: Spacing.md,
                        borderRadius: Spacing.radiusLg,
                        backgroundColor: Colors.input,
                        alignItems: "center",
                    }}
                >
                    <Text style={textStyles.h3}>
                        {selectedActivePeriod.endDate.split("T")[0]}
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        router.push(
                            `./recap/${finishedPeriods[0].periodId}?period=${finishedPeriods[0].period}`
                        );
                    }}
                    style={{
                        paddingVertical: Spacing.xl,
                        marginVertical: Spacing.md,
                        borderRadius: Spacing.radiusLg,
                        backgroundColor: Colors.input,
                        alignItems: "center",
                    }}
                >
                    <Text style={textStyles.h3}>
                        {finishedPeriods[0]
                            ? `${finishedPeriods[0].data.endDate.split("T")[0]}`
                            : "You don't have any finished periods yet."}
                    </Text>
                </Pressable>
            </ScrollView>
        </SwipeDownScreen>
    );
};

export default RecapScreen;

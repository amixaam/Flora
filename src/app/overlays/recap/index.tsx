import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SegmentedButtons, Text, TouchableRipple } from "react-native-paper";
import SheetHeader from "../../../Components/UI/Headers/SheetHeader";
import TextHeader from "../../../Components/UI/Text/TextHeader";
import SwipeDownScreen from "../../../Components/UI/Utils/SwipeDownScreen";
import { useRecapStore } from "../../../store/recapStore";
import { Colors, Spacing } from "../../../styles/constants";
import { mainStyles, newStyles, utilStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { FinishedPeriod, RECAP_PERIOD } from "../../../types/recap";
import IconButton from "../../../Components/UI/Buttons/IconButton";
import { UISeperator } from "../../../Components/UI/Utils/UISeperator";
import MainButton from "../../../Components/UI/Buttons/MainButton";
import ListItemsNotFound from "../../../Components/UI/Text/ListItemsNotFound";
import DeleteContainer from "../../../Components/Modals/DeleteContainer";

const RecapScreen = () => {
    const {
        activePeriods,
        setActivePeriods,
        getClosestPeriodEndDate,
        getFinishedPeriods,
        exportData,
        importData,
        resetRecapData,
    } = useRecapStore();

    const [value, setValue] = useState<string[]>(activePeriods);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const ChangeActivePeriod = (value: string[]) => {
        setActivePeriods(value as RECAP_PERIOD[]);
        setValue(value);
    };

    const deleteData = () => {
        resetRecapData();
        setShowDeleteModal(false);
        router.push("overlays/recap");
    };

    const finishedPeriods = getFinishedPeriods();
    const latestPeriod = finishedPeriods[0];

    const nextRecapTime = getClosestPeriodEndDate()?.humanReadable;

    return (
        <SwipeDownScreen header={<SheetHeader title="Recaps" />}>
            <View style={{ gap: Spacing.md }}>
                {/* selector */}
                <View style={{ marginHorizontal: Spacing.appPadding }}>
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
                            label:
                                period.charAt(0) +
                                period.slice(1).toLowerCase(),
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
                            {`Next Recap ${nextRecapTime}`}
                        </Text>
                    </View>
                </View>
                {!latestPeriod && (
                    <View
                        style={{
                            width: "75%",
                            alignSelf: "center",
                            marginBottom: Spacing.xl,
                        }}
                    >
                        <ListItemsNotFound
                            text={`No Recaps recorded yet, check back ${nextRecapTime}!`}
                        />
                    </View>
                )}
                {latestPeriod && (
                    <View
                        style={[
                            newStyles.recapBanner,
                            utilStyles.center,
                            {
                                backgroundColor: Colors.badgeRare,
                                aspectRatio: 16 / 6,
                            },
                        ]}
                    >
                        <TouchableRipple
                            onPress={() => {
                                router.push(
                                    `overlays/recap/${latestPeriod.periodId}?period=${latestPeriod.period}`
                                );
                            }}
                            style={[mainStyles.fullSize, utilStyles.center]}
                        >
                            <TextHeader
                                text={`${latestPeriod.period} Recap`}
                                style={{
                                    textTransform: "capitalize",
                                }}
                            />
                        </TouchableRipple>
                    </View>
                )}

                <FinishedPeriodsList periods={finishedPeriods} />

                <View
                    style={{
                        marginHorizontal: Spacing.appPadding,
                        gap: Spacing.sm,
                        marginTop: Spacing.sm,
                    }}
                >
                    <TextHeader text="Recap data" style={textStyles.h5} />
                    <View style={{ gap: Spacing.sm, flexDirection: "row" }}>
                        <MainButton
                            flex
                            type="secondary"
                            text="Export"
                            onPress={exportData}
                            disabled={!latestPeriod}
                        />
                        <MainButton
                            flex
                            type="secondary"
                            text="Import"
                            onPress={importData}
                        />
                        <MainButton
                            flex
                            type="secondary"
                            text="Delete"
                            onPress={() => setShowDeleteModal(true)}
                            disabled={!latestPeriod}
                        />
                    </View>
                </View>

                <UISeperator />
                <View
                    style={{
                        marginHorizontal: Spacing.appPadding,
                        gap: Spacing.sm,
                    }}
                >
                    <Text style={textStyles.tip}>
                        Recaps Appear at the selected frequency at midnight.
                    </Text>
                    <Text style={textStyles.tip}>
                        {"Recap frequency appearance dates:\n"}
                        {"• Weekly - on Mondays\n"}
                        {"• Monthly - on the first of every month\n"}
                        {
                            "• Quarterly - on the first day of every quarter (3months)\n"
                        }
                        {"• Yearly - every 1st of December"}
                    </Text>
                    <Text style={textStyles.tip}>
                        You have a total of {finishedPeriods.length} Recaps
                    </Text>
                </View>
            </View>
            <DeleteContainer
                containerType="Recap data"
                visible={showDeleteModal}
                confirm={deleteData}
                dismiss={() => setShowDeleteModal(false)}
            />
        </SwipeDownScreen>
    );
};

interface FinishedPeriodsListProps {
    periods: FinishedPeriod[];
}

const FinishedPeriodsList = ({ periods }: FinishedPeriodsListProps) => {
    if (periods.length === 0) return null;

    return (
        <View
            style={{
                marginHorizontal: Spacing.appPadding,
                marginTop: Spacing.sm,
                gap: Spacing.sm,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <TextHeader text="Previous Recaps" style={textStyles.h5} />
                {periods.length >= 2 && (
                    <IconButton
                        icon={"chevron-right"}
                        iconColor={Colors.primary}
                        onPress={() => router.push("./recap/history")}
                    />
                )}
            </View>
            <ScrollView horizontal contentContainerStyle={{ gap: Spacing.sm }}>
                {periods.slice(1).map((period) => (
                    <View
                        key={period.periodId}
                        style={{
                            borderRadius: Spacing.radius,
                            backgroundColor: Colors.input,
                            overflow: "hidden",
                            aspectRatio: 2 / 3,
                            width: 164,
                        }}
                    >
                        <TouchableRipple
                            onPress={() => {
                                router.push(
                                    `./recap/${period.periodId}?period=${period.period}`
                                );
                            }}
                            style={[
                                mainStyles.fullSize,
                                {
                                    padding: Spacing.md,
                                    justifyContent: "flex-end",
                                },
                            ]}
                        >
                            <Text style={textStyles.h5}>
                                {period.data.endDate
                                    ? `${period.data.endDate.split("T")[0]}`
                                    : "You don't have any finished periods yet."}
                            </Text>
                        </TouchableRipple>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default RecapScreen;

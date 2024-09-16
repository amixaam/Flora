import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { Text, View } from "react-native";
import { useSongsStore } from "../../../store/songs";
import { SnapPoints, Spacing } from "../../../styles/constants";
import { BottomSheetProps } from "../../../types/other";
import LargeTextButton from "../../UI/LargeTextButton";
import StatisticDisplay from "../../UI/StatisticDisplay";
import { SheetModalLayout } from "../SheetModalLayout";
import { FormatSecs } from "../../../utils/FormatMillis";
import LargeOptionButton from "../../UI/LargeOptionButton";
import { UISeperator } from "../../UI/UISeperator";
import { textStyles } from "../../../styles/text";

const SongStatistics = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedSong } = useSongsStore();

        if (selectedSong === undefined) return;

        const statistics = selectedSong.statistics;
        const lastPlayedUnfiltered = statistics.lastPlayed;

        let lastPlayed = "Never";
        if (lastPlayedUnfiltered) {
            lastPlayed = new Date(lastPlayedUnfiltered).toLocaleDateString();
        }

        const timeListened = Math.round(
            (selectedSong.duration * statistics.playCount) / 60 / 60
        );

        return (
            <>
                <SheetModalLayout
                    ref={ref}
                    title={`Song statistics`}
                    snapPoints={[SnapPoints.lg]}
                >
                    <BottomSheetView
                        style={{
                            marginHorizontal: Spacing.appPadding,
                            gap: Spacing.md,
                        }}
                    >
                        <BottomSheetView
                            style={{
                                flexDirection: "row",
                                gap: Spacing.sm,
                            }}
                        >
                            <LargeTextButton
                                mainText={statistics.skipCount.toString()}
                                subText="Hours listened"
                            />
                            <LargeTextButton
                                mainText={statistics.skipCount.toString()}
                                subText="Album rank"
                            />
                            <LargeTextButton
                                mainText={statistics.skipCount.toString()}
                                subText="Skips"
                            />
                        </BottomSheetView>
                        <UISeperator />
                        <View style={{ gap: Spacing.sm }}>
                            <StatisticDisplay
                                icon="history"
                                header="Last played"
                                text={lastPlayed}
                            />
                            <StatisticDisplay
                                icon="timelapse"
                                header="Time listened"
                                text={timeListened}
                            />
                        </View>
                        <UISeperator />
                        <Text style={textStyles.h5}>Badges</Text>
                    </BottomSheetView>
                </SheetModalLayout>
            </>
        );
    }
);

export default SongStatistics;

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { Text } from "react-native";
import { useSongsStore } from "../../store/songs";
import { SnapPoints, Spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";
import { BottomSheetProps } from "../../types/other";
import LargeTextButton from "../UI/LargeTextButton";
import { SheetModalLayout } from "./SheetModalLayout";

const SongStatistics = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedSong } = useSongsStore();

        if (selectedSong === null) return;
        return (
            <>
                <SheetModalLayout
                    ref={ref}
                    title={`Statistics for ${selectedSong.title}`}
                    snapPoints={[SnapPoints.lg]}
                >
                    <BottomSheetView
                        style={{
                            marginHorizontal: Spacing.appPadding,
                        }}
                    >
                        <BottomSheetView
                            style={{
                                rowGap: Spacing.sm,
                                flexDirection: "row",
                                gap: Spacing.sm,
                            }}
                        >
                            <LargeTextButton
                                mainText={selectedSong.statistics.timesPlayed.toString()}
                                subText="Plays"
                            />
                            <LargeTextButton
                                mainText={selectedSong.statistics.timesSkipped.toString()}
                                subText="Skips"
                            />
                        </BottomSheetView>
                        <Text style={textStyles.h6}>
                            Last played:{" "}
                            {selectedSong.statistics.lastPlayed
                                ? selectedSong.statistics.lastPlayed.toISOString()
                                : "Never"}
                        </Text>
                    </BottomSheetView>
                </SheetModalLayout>
            </>
        );
    }
);

export default SongStatistics;

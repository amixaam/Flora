import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { View } from "react-native";
import { useSongsStore } from "../../../store/songs";
import { SnapPoints, Spacing } from "../../../styles/constants";
import { BottomSheetProps } from "../../../types/other";
import LargeTextButton from "../../UI/LargeTextButton";
import SmallTitleBigText from "../../UI/SmallTitleBigText";
import { SheetModalLayout } from "../SheetModalLayout";

const SongStatistics = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedSong } = useSongsStore();

        if (selectedSong === undefined) return;
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
                                mainText={selectedSong.statistics.playCount.toString()}
                                subText="Plays"
                            />
                            <LargeTextButton
                                mainText={selectedSong.statistics.skipCount.toString()}
                                subText="Skips"
                            />
                        </BottomSheetView>
                        <View style={{ gap: Spacing.sm }}>
                            <SmallTitleBigText
                                icon="history"
                                header="Last played"
                                text={"BUSTED"}
                            />
                            <SmallTitleBigText
                                icon="timelapse"
                                header="Hours listened"
                                text="alot"
                            />
                        </View>
                    </BottomSheetView>
                </SheetModalLayout>
            </>
        );
    }
);

export default SongStatistics;

import { forwardRef, useCallback, useRef } from "react";
import { useSongsStore } from "../../store/songs";
import { SnapPoints, Spacing } from "../../styles/constants";
import LargeOptionButton from "../UI/LargeOptionButton";
import SheetOptionsButton from "../UI/SheetOptionsButton";
import AddPlaylistToSong from "./AddPlaylistToSong";
import { SheetModalLayout } from "./SheetModalLayout";
import { BottomSheetProps } from "../../types/other";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Text } from "react-native";
import { textStyles } from "../../styles/text";
import LargeTextButton from "../UI/LargeTextButton";

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
                            rowGap: Spacing.sm,
                            marginHorizontal: Spacing.appPadding,
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
                </SheetModalLayout>
            </>
        );
    }
);

export default SongStatistics;

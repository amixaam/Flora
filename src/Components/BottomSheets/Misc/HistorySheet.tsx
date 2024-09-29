import { forwardRef, useCallback, useRef } from "react";
import { useSongsStore } from "../../../store/songs";
import { SnapPoints, Spacing } from "../../../styles/constants";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import { BottomSheetProps } from "../../../types/other";
import SongListItem from "../../SongListItem";
import { SheetModalLayout } from "../SheetModalLayout";
import SongSheet from "../Song/SongSheet";
import ListItemsNotFound from "../../UI/ListItemsNotFound";

const HistorySheet = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { getHistory, getSong, setSelectedSong } = useSongsStore();
        const history = getHistory().history;

        const SongRef = useRef<BottomSheetModal>(null);
        const openSong = useCallback(() => {
            SongRef.current?.present();
        }, []);

        const dismissSong = useCallback(() => {
            SongRef.current?.dismiss();
        }, []);

        return (
            <>
                <SheetModalLayout
                    ref={ref}
                    title={"History"}
                    snapPoints={[SnapPoints.full]}
                >
                    <FlatList
                        data={history}
                        contentContainerStyle={{
                            paddingBottom: Spacing.xl,
                        }}
                        keyExtractor={(item) => item.date.toString()}
                        ListEmptyComponent={
                            <ListItemsNotFound
                                icon="history"
                                text="No history yet!"
                            />
                        }
                        renderItem={({ item }) => {
                            const song = getSong(item.song);
                            if (!song) return null;

                            return (
                                <SongListItem
                                    item={song}
                                    showImage
                                    onLongPress={() => {
                                        setSelectedSong(song);
                                        openSong();
                                    }}
                                    onSecondaryButtonPress={() => {
                                        setSelectedSong(song);
                                        openSong();
                                    }}
                                    secondaryButtonIcon={"dots-vertical"}
                                />
                            );
                        }}
                    />
                </SheetModalLayout>
                <SongSheet ref={SongRef} dismiss={dismissSong} />
            </>
        );
    }
);

export default HistorySheet;

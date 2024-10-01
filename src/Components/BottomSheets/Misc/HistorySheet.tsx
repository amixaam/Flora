import { forwardRef, useCallback, useRef } from "react";
import { useSongsStore } from "../../../store/songs";
import { SnapPoints, Spacing } from "../../../styles/constants";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import { BottomSheetProps } from "../../../types/other";
import SongListItem from "../../SongListItem";
import { SheetModalLayout } from "../SheetModalLayout";
import SongSheet from "../Song/SongSheet";
import ListItemsNotFound from "../../UI/ListItemsNotFound";
import { Text } from "react-native";
import { textStyles } from "../../../styles/text";
import IconButton from "../../UI/IconButton";

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
                    snapPoints={[SnapPoints.full]}
                    customHeader={<HistorySheetHeader />}
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

const HistorySheetHeader = () => {
    return (
        <BottomSheetView
            style={{
                marginBottom: Spacing.md,
                marginHorizontal: Spacing.appPadding,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Text style={[textStyles.h5, { marginBottom: -2 }]}>
                Song history
            </Text>
            <IconButton icon="dots-vertical" />
        </BottomSheetView>
    );
};

export default HistorySheet;

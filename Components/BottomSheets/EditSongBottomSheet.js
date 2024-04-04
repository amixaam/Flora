import {
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from "react-native";
import { forwardRef, useCallback, useMemo, useRef } from "react";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSongsStore } from "../../store/songs";
import AddSongToPlaylistBottomSheet from "./AddSongToPlaylistBottomSheet";
import RemoveSongToPlaylistBottomSheet from "./removeSongFromPlaylistBottomSheet";

const EditSongBottomSheet = forwardRef(({ props }, ref) => {
    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
        />
    ));

    const { selectedSong, hideSong, unhideSong } = useSongsStore();

    const addSongBottomSheetRef = useRef(null);
    const handleOpenAddSongBottomSheet = () =>
        addSongBottomSheetRef.current.present();

    const removeSongBottomSheetRef = useRef(null);
    const handleRemoveSongBottomSheet = () =>
        removeSongBottomSheetRef.current.present();

    const handleHideSongPress = () => {
        ref.current.dismiss();
        if (selectedSong.isHidden) unhideSong(selectedSong.id);
        else hideSong(selectedSong.id);
    };

    if (selectedSong === null) return;
    return (
        <>
            <BottomSheetModal
                ref={ref}
                index={1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                handleIndicatorStyle={{
                    borderRadius: 50,
                }}
                backdropComponent={renderBackdrop}
            >
                <BottomSheetView style={{ paddingHorizontal: 16 }}>
                    <BottomSheetView style={styles.sheetHeader}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                            {selectedSong.name}
                        </Text>
                    </BottomSheetView>
                    <TouchableNativeFeedback
                        onPress={() => {
                            ref.current.dismiss();
                            handleOpenAddSongBottomSheet();
                        }}
                    >
                        <View style={styles.listItem}>
                            <Text>Add to Playlist</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={() => {
                            ref.current.dismiss();
                            handleRemoveSongBottomSheet();
                        }}
                    >
                        <View style={styles.listItem}>
                            <Text>Remove from Playlist</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={handleHideSongPress}>
                        <View style={styles.listItem}>
                            <Text>
                                {selectedSong.isHidden ? "Show" : "Hide"} this
                                song
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </BottomSheetView>
            </BottomSheetModal>
            <AddSongToPlaylistBottomSheet ref={addSongBottomSheetRef} />
            <RemoveSongToPlaylistBottomSheet ref={removeSongBottomSheetRef} />
        </>
    );
});

const styles = StyleSheet.create({
    sheetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: "lightgray",
        width: "100%",
        paddingBottom: 4,
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
});

export default EditSongBottomSheet;

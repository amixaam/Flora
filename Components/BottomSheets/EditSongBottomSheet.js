import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { forwardRef, useCallback, useMemo, useRef } from "react";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSongsStore } from "../../store/songs";
import AddSongToPlaylistBottomSheet from "./AddSongToPlaylistBottomSheet";

const EditSongBottomSheet = forwardRef(({ props }, ref) => {
    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
        />
    ));

    const { selectedSong } = useSongsStore();

    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => bottomSheetRef.current.present();

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
                    <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => {
                            ref.current.dismiss();
                            handleOpenPress();
                        }}
                    >
                        <Text>Add to Playlist</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheetModal>
            <AddSongToPlaylistBottomSheet ref={bottomSheetRef} />
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

import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import { forwardRef, useCallback, useMemo, useRef } from "react";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSongsStore } from "../../store/songs";
import EditPlaylistBottomSheet from "./EditPlaylistBottomSheet";

const EditPlaylistOptionsBottomSheet = forwardRef(({ props }, ref) => {
    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
        />
    ));

    // TODO: add a confirmation modal for deleting things
    const { selectedPlaylist, deletePlaylist } = useSongsStore();

    const handleDeletePlaylist = () => {
        if (selectedPlaylist.id == 1) return;

        ref.current.dismiss();
        deletePlaylist(selectedPlaylist.id);
    };

    const handleEditPlaylist = () => {
        if (selectedPlaylist.id == 1) return;

        ref.current.dismiss();
        editPlaylistBottomSheetRef.current.present();
    };

    const editPlaylistBottomSheetRef = useRef(null);
    const handleRemoveSongBottomSheet = () =>
        editPlaylistBottomSheetRef.current.present();

    if (selectedPlaylist === null) return;
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
                            {selectedPlaylist.name}
                        </Text>
                    </BottomSheetView>

                    <TouchableNativeFeedback
                        disabled={selectedPlaylist.id == 1}
                        activeOpacity={selectedPlaylist.id == 1 ? 0.5 : 1}
                        onPress={handleEditPlaylist}
                    >
                        <View style={styles.listItem}>
                            <Text
                                style={
                                    selectedPlaylist.id == 1
                                        ? { opacity: 0.5 }
                                        : undefined
                                }
                            >
                                Edit playlist
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        disabled={selectedPlaylist.id == 1}
                        activeOpacity={selectedPlaylist.id == 1 ? 0.5 : 1}
                        onPress={handleDeletePlaylist}
                    >
                        <View style={styles.listItem}>
                            <Text
                                style={
                                    selectedPlaylist.id == 1
                                        ? { opacity: 0.5 }
                                        : undefined
                                }
                            >
                                Delete playlist
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </BottomSheetView>
            </BottomSheetModal>
            <EditPlaylistBottomSheet ref={editPlaylistBottomSheetRef} />
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
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        columnGap: 16,
        borderColor: "#F3EDF6",
    },
});

export default EditPlaylistOptionsBottomSheet;

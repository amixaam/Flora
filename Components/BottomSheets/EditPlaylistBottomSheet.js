import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { forwardRef, useCallback, useMemo, useRef } from "react";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSongsStore } from "../../store/songs";

const EditPlaylistBottomSheet = forwardRef(({ props }, ref) => {
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

    if (selectedPlaylist === null) return;
    return (
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
                <TouchableOpacity
                    style={styles.listItem}
                    disabled={selectedPlaylist.id == 1}
                    activeOpacity={selectedPlaylist.id == 1 ? 0.5 : 1}
                    onPress={handleDeletePlaylist}
                >
                    <Text
                        style={
                            selectedPlaylist.id == 1
                                ? { opacity: 0.5 }
                                : undefined
                        }
                    >
                        Delete playlist
                    </Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheetModal>
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

export default EditPlaylistBottomSheet;

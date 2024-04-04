import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput,
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
    const { selectedPlaylist, editPlaylist } = useSongsStore();

    const handleSubmitForm = () => {
        if (selectedPlaylist.id == 1) return;

        editPlaylist(selectedPlaylist.id, name, description);
        ref.current.dismiss();
        setName("");
        setDescription("");
    };

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

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
            <BottomSheetView
                style={{
                    paddingHorizontal: 16,
                    rowGap: 8,
                    justifyContent: "center",
                }}
            >
                <BottomSheetView style={styles.sheetHeader}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        Edit {selectedPlaylist.name}
                    </Text>
                </BottomSheetView>
                <BottomSheetTextInput
                    style={styles.textInput}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <BottomSheetTextInput
                    style={styles.textInput}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                />
                <TouchableNativeFeedback onPress={handleSubmitForm}>
                    <View style={styles.button}>
                        <Text
                            style={{
                                textAlign: "center",
                            }}
                        >
                            Save
                        </Text>
                    </View>
                </TouchableNativeFeedback>
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
    textInput: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: "lightgray",
        borderBottomWidth: 1,
    },
    button: {
        width: "fit-content",
        marginHorizontal: "auto",
        paddingVertical: 8,
        backgroundColor: "lightgray",
    },
});

export default EditPlaylistBottomSheet;

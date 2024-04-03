import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSongsStore } from "../../store/songs";

const CreatePlaylistBottomSheet = forwardRef(({ props }, ref) => {
    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
        />
    ));

    // TODO: add a confirmation modal for deleting things
    const { createPlaylist } = useSongsStore();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        createPlaylist(name, description);
        ref.current.dismiss();
        setDescription("");
        setName("");
    };

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
            <BottomSheetView style={{ paddingHorizontal: 16, rowGap: 8 }}>
                <BottomSheetView style={styles.sheetHeader}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        Create playlist
                    </Text>
                </BottomSheetView>
                <BottomSheetTextInput
                    style={styles.textInput}
                    placeholder="Name"
                    onChangeText={setName}
                    value={name}
                />
                <BottomSheetTextInput
                    style={styles.textInput}
                    placeholder="Description"
                    onChangeText={setDescription}
                    value={description}
                />
                <Button title="Create" onPress={handleSubmit} />
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
});

export default CreatePlaylistBottomSheet;

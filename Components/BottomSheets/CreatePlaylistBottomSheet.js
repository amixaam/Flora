import {
    Button,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from "react-native";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSongsStore } from "../../store/songs";
import SheetLayout from "./SheetLayout";
import { mainStyles } from "../styles";

const CreatePlaylistBottomSheet = forwardRef(({ props }, ref) => {
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
        <SheetLayout ref={ref} title={"Create playlist"}>
            <BottomSheetView style={{ rowGap: 8, flex: 1 }}>
                <BottomSheetTextInput
                    style={mainStyles.textInput}
                    placeholderTextColor={"rgba(74, 68, 88, 1)"}
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                />
                <BottomSheetTextInput
                    style={mainStyles.textInput}
                    placeholderTextColor={"rgba(74, 68, 88, 1)"}
                    placeholder="Description"
                    onChangeText={setDescription}
                    value={description}
                />
                <TouchableNativeFeedback onPress={handleSubmit}>
                    <View style={mainStyles.formButton}>
                        <Text
                            style={[
                                mainStyles.text_16,
                                { textAlign: "center" },
                            ]}
                        >
                            Create
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </BottomSheetView>
        </SheetLayout>
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

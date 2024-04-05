import {
    Image,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
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
import * as ImagePicker from "expo-image-picker";

const EditPlaylistBottomSheet = forwardRef(({ props }, ref) => {
    const snapPoints = useMemo(() => ["25%", "75%", "90%"], []);
    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
        />
    ));

    // TODO: add a confirmation modal for deleting things
    const { selectedPlaylist, editPlaylist } = useSongsStore();
    const [image, setImage] = useState(selectedPlaylist.image);
    const [name, setName] = useState(selectedPlaylist.name);
    const [description, setDescription] = useState(
        selectedPlaylist.description
    );

    const pickImage = async () => {
        await ImagePicker.getMediaLibraryPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result.assets[0].uri);
        if (!result.canceled) setImage(result.assets[0].uri);
    };

    const handleSubmitForm = () => {
        if (selectedPlaylist.id == 1) return;

        editPlaylist(selectedPlaylist.id, name, description, image);
        ref.current.dismiss();
        setImage(null);
        setName("");
        setDescription("");
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
                <Image
                    source={{ uri: image }}
                    style={{
                        alignSelf: "center",
                        width: "50%",
                        aspectRatio: 1,
                        backgroundColor: "gray",
                        borderRadius: 7,
                    }}
                />
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

                <TouchableNativeFeedback onPress={pickImage}>
                    <View style={styles.button}>
                        <Text
                            style={{
                                textAlign: "center",
                            }}
                        >
                            Pick image
                        </Text>
                    </View>
                </TouchableNativeFeedback>
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

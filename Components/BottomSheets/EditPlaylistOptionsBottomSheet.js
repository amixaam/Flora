import { Text, TouchableNativeFeedback, View } from "react-native";
import { forwardRef, useRef } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSongsStore } from "../../store/songs";
import EditPlaylistBottomSheet from "./EditPlaylistBottomSheet";
import SheetLayout from "./SheetLayout";
import { mainStyles } from "../styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const EditPlaylistOptionsBottomSheet = forwardRef(({ props }, ref) => {
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
            <SheetLayout ref={ref} title={"Edit " + selectedPlaylist.name}>
                <BottomSheetView style={{ marginHorizontal: -18 }}>
                    <OptionsButton
                        data={selectedPlaylist}
                        icon="shuffle"
                        buttonContent={"Shuffle play"}
                        onPress={handleEditPlaylist}
                        enabledForLikes={true}
                    />
                    <OptionsButton
                        data={selectedPlaylist}
                        icon="playlist-plus"
                        buttonContent={"Add songs to playlist"}
                        onPress={handleEditPlaylist}
                        enabledForLikes={true}
                    />
                    <OptionsButton
                        data={selectedPlaylist}
                        icon="playlist-edit"
                        buttonContent={"Edit playlist"}
                        onPress={handleEditPlaylist}
                    />
                    <OptionsButton
                        data={selectedPlaylist}
                        icon="playlist-remove"
                        buttonContent={"Delete playlist"}
                        onPress={handleDeletePlaylist}
                    />
                </BottomSheetView>
            </SheetLayout>
            <EditPlaylistBottomSheet ref={editPlaylistBottomSheetRef} />
        </>
    );
});

const OptionsButton = ({
    data,
    icon = "arrow-right",
    buttonContent,
    onPress,
    enabledForLikes = false,
}) => {
    const isDisabled = enabledForLikes || data.id != 1;

    return (
        <TouchableNativeFeedback disabled={!isDisabled} onPress={onPress}>
            <View
                style={[
                    mainStyles.textListItem,
                    !isDisabled ? mainStyles.hiddenListItem : undefined,
                ]}
            >
                <MaterialCommunityIcons
                    name={icon}
                    size={24}
                    style={[mainStyles.color_text]}
                />
                <Text style={[mainStyles.text_16]}>{buttonContent}</Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default EditPlaylistOptionsBottomSheet;

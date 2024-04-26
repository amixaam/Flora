import { Text, TouchableNativeFeedback, View } from "react-native";
import { forwardRef, useRef, useState } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSongsStore } from "../../store/songs";
import EditPlaylistBottomSheet from "./EditPlaylistBottomSheet";
import SheetLayout from "./SheetLayout";
import { mainStyles, textStyles } from "../styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ChangeMultipleSongPlaylistStatus from "./ChangeMultipleSongPlaylistStatus";
import DeletePlaylistConfirm from "../Modals/DeletePlaylistConfirm";

const EditPlaylistOptionsBottomSheet = forwardRef(({ props }, ref) => {
    // TODO: add a confirmation modal for deleting things
    const { selectedPlaylist, deletePlaylist, loadTrack, getSong, shuffle } =
        useSongsStore();

    const handleDeletePlaylist = () => {
        if (selectedPlaylist.id == 1) return;

        ref.current.dismiss();
        setDeleteConfirm(false);

        deletePlaylist(selectedPlaylist.id);
    };

    const handleEditPlaylist = () => {
        if (selectedPlaylist.id == 1) return;

        ref.current.dismiss();
        editPlaylistBottomSheetRef.current.present();
    };

    const handleAddSongsToPlaylist = () => {
        ref.current.dismiss();
        changeMultipleSongPlaylistStatusBottomSheetRef.current.present();
    };

    const handleShufflePlay = () => {
        loadTrack(getSong(selectedPlaylist.songs[0]), selectedPlaylist, true);
        ref.current.dismiss();
    };

    const editPlaylistBottomSheetRef = useRef(null);
    const changeMultipleSongPlaylistStatusBottomSheetRef = useRef(null);

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const handleDeleteConfirm = () => setDeleteConfirm(!deleteConfirm);

    if (selectedPlaylist === null) return;
    return (
        <>
            <SheetLayout ref={ref} title={"Edit " + selectedPlaylist.name}>
                <BottomSheetView style={{ marginHorizontal: -18 }}>
                    <OptionsButton
                        data={selectedPlaylist}
                        icon="shuffle"
                        buttonContent={"Shuffle play"}
                        onPress={handleShufflePlay}
                        enabledForLikes={true}
                    />
                    <OptionsButton
                        data={selectedPlaylist}
                        icon="playlist-plus"
                        buttonContent={"Add songs to playlist"}
                        onPress={handleAddSongsToPlaylist}
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
                        onPress={handleDeleteConfirm}
                    />
                </BottomSheetView>
            </SheetLayout>
            <DeletePlaylistConfirm
                visible={deleteConfirm}
                dismiss={handleDeleteConfirm}
                deletePlaylist={handleDeletePlaylist}
            />
            <EditPlaylistBottomSheet ref={editPlaylistBottomSheetRef} />
            <ChangeMultipleSongPlaylistStatus
                ref={changeMultipleSongPlaylistStatusBottomSheetRef}
                mode="add"
            />
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
                    size={16}
                    style={[mainStyles.color_text]}
                />
                <Text style={[textStyles.text]}>{buttonContent}</Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default EditPlaylistOptionsBottomSheet;

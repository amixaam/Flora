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
import SheetLayout from "./SheetLayout";
import { mainStyles, textStyles } from "../styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
            <SheetLayout ref={ref} title={"Edit " + selectedSong.name}>
                <BottomSheetView style={{ marginHorizontal: -18 }}>
                    <OptionsButton
                        icon="playlist-plus"
                        buttonContent={"Add to playlist"}
                        onPress={() => {
                            ref.current.dismiss();
                            handleOpenAddSongBottomSheet();
                        }}
                    />
                    <OptionsButton
                        icon="playlist-minus"
                        buttonContent={"Remove from playlist"}
                        onPress={() => {
                            ref.current.dismiss();
                            handleRemoveSongBottomSheet();
                        }}
                    />
                    <OptionsButton
                        icon={selectedSong.isHidden ? "eye" : "eye-off"}
                        buttonContent={
                            selectedSong.isHidden ? "Show song" : "Hide song"
                        }
                        onPress={handleHideSongPress}
                    />
                </BottomSheetView>
            </SheetLayout>
            <AddSongToPlaylistBottomSheet ref={addSongBottomSheetRef} />
            <RemoveSongToPlaylistBottomSheet ref={removeSongBottomSheetRef} />
        </>
    );
});

const OptionsButton = ({
    icon = "arrow-right",
    buttonContent,
    onPress,
    isDisabled = false,
}) => {
    return (
        <TouchableNativeFeedback disabled={isDisabled} onPress={onPress}>
            <View
                style={[
                    mainStyles.textListItem,
                    isDisabled ? mainStyles.hiddenListItem : undefined,
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

export default EditSongBottomSheet;

import { ScrollView } from "react-native-gesture-handler";
import CreatePlaylist from "../../../Components/BottomSheets/Playlist/CreatePlaylist";
import { MainHeader } from "../../../Components/UI/Headers/MainHeader";
import { TwoColContainerList } from "../../../Components/UI/UI chunks/TwoColContainerList";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { mainStyles } from "../../../styles/styles";
import CustomFAB from "../../../Components/UI/Buttons/CustomFAB";
import { View } from "react-native";
import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";
import { Playlist } from "../../../types/song";
import useMultiSelect from "../../../hooks/useMultiSelect";
import IconButton from "../../../Components/UI/Buttons/IconButton";

export default function PlaylistsTab() {
    const {
        sheetRef: CreatePlaylistRef,
        open: openCreatePlaylist,
        close: dismissCreatePlaylist,
    } = useBottomSheetModal();

    const {
        multiselectedItems,
        multiselectMode,
        toggle,
        deselectAll,
        setSelection,
    } = useMultiSelect<Playlist["id"]>();

    return (
        <View style={mainStyles.container}>
            <BackgroundImageAbsolute />
            <CustomFAB onPress={openCreatePlaylist} />
            <ScrollView>
                {multiselectedItems.length > 0 ? (
                    <MainHeader
                        title={`${multiselectedItems.length} selected`}
                        headerRight={
                            <>
                                <IconButton
                                    icon="close"
                                    onPress={deselectAll}
                                />
                                <IconButton icon="dots-vertical" />
                            </>
                        }
                    />
                ) : (
                    <MainHeader title={"Playlists"} />
                )}
                <TwoColContainerList
                    type="playlist"
                    multiselectMode={multiselectMode}
                    selectedItems={multiselectedItems}
                    toggle={toggle}
                />
            </ScrollView>
            <CreatePlaylist
                ref={CreatePlaylistRef}
                dismiss={dismissCreatePlaylist}
            />
        </View>
    );
}

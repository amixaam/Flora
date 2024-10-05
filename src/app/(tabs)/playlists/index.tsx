import { ScrollView } from "react-native-gesture-handler";
import CreatePlaylist from "../../../Components/BottomSheets/Playlist/CreatePlaylist";
import { MainHeader } from "../../../Components/UI/Headers/MainHeader";
import { TwoColContainerList } from "../../../Components/UI/UI chunks/TwoColContainerList";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { mainStyles } from "../../../styles/styles";
import CustomFAB from "../../../Components/UI/Buttons/CustomFAB";
import { View } from "react-native";
import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";

export default function PlaylistsTab() {
    const {
        sheetRef: CreatePlaylistRef,
        open: openCreatePlaylist,
        close: dismissCreatePlaylist,
    } = useBottomSheetModal();

    return (
        <View style={mainStyles.container}>
            <BackgroundImageAbsolute />
            <CustomFAB onPress={openCreatePlaylist} />
            <ScrollView>
                <MainHeader title="Playlists" />
                <TwoColContainerList type="playlist" />
            </ScrollView>
            <CreatePlaylist
                ref={CreatePlaylistRef}
                dismiss={dismissCreatePlaylist}
            />
        </View>
    );
}

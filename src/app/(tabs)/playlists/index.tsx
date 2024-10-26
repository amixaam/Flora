import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CustomFAB from "../../../Components/UI/Buttons/CustomFAB";
import IconButton from "../../../Components/UI/Buttons/IconButton";
import { MainHeader } from "../../../Components/UI/Headers/MainHeader";
import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";
import { TwoColContainerList } from "../../../Components/UI/UI chunks/TwoColContainerList";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import useMultiSelect from "../../../hooks/useMultiSelect";
import { Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { ContainerType, Playlist } from "../../../types/song";
import CreateContainer from "../../../Components/BottomSheets/Container/CreateContainer";

export default function PlaylistsTab() {
    const {
        sheetRef: CreatePlaylistRef,
        open: openCreatePlaylist,
        close: dismissCreatePlaylist,
    } = useBottomSheetModal();

    const { multiselectedItems, toggle, deselectAll } =
        useMultiSelect<Playlist["id"]>();

    return (
        <View style={mainStyles.container}>
            <BackgroundImageAbsolute />
            <CustomFAB onPress={openCreatePlaylist} />
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: Spacing.miniPlayer,
                }}
            >
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
                    selectedItems={multiselectedItems}
                    toggle={toggle}
                />
            </ScrollView>
            <CreateContainer
                type={ContainerType.PLAYLIST}
                ref={CreatePlaylistRef}
                dismiss={dismissCreatePlaylist}
            />
        </View>
    );
}

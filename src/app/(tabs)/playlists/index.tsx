import { useNavigation } from "expo-router";
import { View } from "react-native";

import { useEffect } from "react";
import { useSongsStore } from "../../../store/songs";

import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";
import CreatePlaylist from "../../../Components/BottomSheets/Playlist/CreatePlaylist";
import { TwoColContainerList } from "../../../Components/UI/UI chunks/TwoColContainerList";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { mainStyles } from "../../../styles/styles";
import IconButton from "../../../Components/UI/Buttons/IconButton";

export default function PlaylistsTab() {
    useSongsStore();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon="plus"
                    touchableOpacityProps={{
                        onPress: openCreatePlaylist,
                    }}
                />
            ),
        });
    }, [navigation]);

    const {
        sheetRef: CreatePlaylistRef,
        open: openCreatePlaylist,
        close: dismissCreatePlaylist,
    } = useBottomSheetModal();

    return (
        <View style={[mainStyles.container]}>
            <BackgroundImageAbsolute />
            <TwoColContainerList type="playlist" />
            <CreatePlaylist
                ref={CreatePlaylistRef}
                dismiss={dismissCreatePlaylist}
            />
        </View>
    );
}

import { useNavigation } from "expo-router";
import { View } from "react-native";

import { useCallback, useEffect, useRef } from "react";
import { useSongsStore } from "../../../store/songs";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BackgroundImageAbsolute from "../../../Components/BackgroundImageAbsolute";
import CreatePlaylist from "../../../Components/BottomSheets/Playlist/CreatePlaylist";
import IconButton from "../../../Components/UI/IconButton";
import { TwoColContainerList } from "../../../Components/UI/TwoColContainerList";
import { mainStyles } from "../../../styles/styles";

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

    const CreatePlaylistRef = useRef<BottomSheetModal>(null);
    const openCreatePlaylist = useCallback(
        () => CreatePlaylistRef.current?.present(),
        []
    );
    const dismissCreatePlaylist = useCallback(
        () => CreatePlaylistRef.current?.dismiss(),
        []
    );

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

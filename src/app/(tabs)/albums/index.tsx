import { useNavigation } from "expo-router";
import { View } from "react-native";

import { useCallback, useEffect, useRef } from "react";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BackgroundImageAbsolute from "../../../Components/BackgroundImageAbsolute";
import CreateAlbum from "../../../Components/BottomSheets/Album/CreateAlbum";
import IconButton from "../../../Components/UI/IconButton";
import { TwoColContainerList } from "../../../Components/UI/TwoColContainerList";
import { mainStyles } from "../../../styles/styles";

export default function AlbumsTab() {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon="plus"
                    touchableOpacityProps={{
                        onPress: openCreateAlbum,
                    }}
                />
            ),
        });
    }, [navigation]);

    const CreateAlbumRef = useRef<BottomSheetModal>(null);
    const openCreateAlbum = useCallback(
        () => CreateAlbumRef.current?.present(),
        []
    );
    const dismissCreateAlbum = useCallback(
        () => CreateAlbumRef.current?.dismiss(),
        []
    );

    return (
        <View style={[mainStyles.container]}>
            <BackgroundImageAbsolute />
            <TwoColContainerList type="album" />
            <CreateAlbum ref={CreateAlbumRef} dismiss={dismissCreateAlbum} />
        </View>
    );
}

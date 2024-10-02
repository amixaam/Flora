import { useNavigation } from "expo-router";
import { View } from "react-native";

import { useEffect } from "react";

import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";
import CreateAlbum from "../../../Components/BottomSheets/Album/CreateAlbum";
import { TwoColContainerList } from "../../../Components/UI/UI chunks/TwoColContainerList";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { mainStyles } from "../../../styles/styles";
import IconButton from "../../../Components/UI/Buttons/IconButton";

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

    const {
        sheetRef: CreateAlbumRef,
        open: openCreateAlbum,
        close: dismissCreateAlbum,
    } = useBottomSheetModal();

    return (
        <View style={[mainStyles.container]}>
            <BackgroundImageAbsolute />
            <TwoColContainerList type="album" />
            <CreateAlbum ref={CreateAlbumRef} dismiss={dismissCreateAlbum} />
        </View>
    );
}

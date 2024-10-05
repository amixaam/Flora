import { ScrollView } from "react-native-gesture-handler";
import CreateAlbum from "../../../Components/BottomSheets/Album/CreateAlbum";
import { MainHeader } from "../../../Components/UI/Headers/MainHeader";
import { TwoColContainerList } from "../../../Components/UI/UI chunks/TwoColContainerList";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { mainStyles } from "../../../styles/styles";
import CustomFAB from "../../../Components/UI/Buttons/CustomFAB";
import { View } from "react-native";
import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";

export default function AlbumsTab() {
    const {
        sheetRef: CreateAlbumRef,
        open: openCreateAlbum,
        close: dismissCreateAlbum,
    } = useBottomSheetModal();

    return (
        <View style={mainStyles.container}>
            <BackgroundImageAbsolute />
            <CustomFAB onPress={openCreateAlbum} />
            <ScrollView>
                <MainHeader title="Albums" />
                <TwoColContainerList type="album" />
            </ScrollView>
            <CreateAlbum ref={CreateAlbumRef} dismiss={dismissCreateAlbum} />
        </View>
    );
}

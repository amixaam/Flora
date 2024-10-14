import { ScrollView } from "react-native-gesture-handler";
import CreateAlbum from "../../../Components/BottomSheets/Album/CreateAlbum";
import { MainHeader } from "../../../Components/UI/Headers/MainHeader";
import { TwoColContainerList } from "../../../Components/UI/UI chunks/TwoColContainerList";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { mainStyles } from "../../../styles/styles";
import CustomFAB from "../../../Components/UI/Buttons/CustomFAB";
import { View } from "react-native";
import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";
import useMultiSelect from "../../../hooks/useMultiSelect";
import { Album } from "../../../types/song";
import { router } from "expo-router";
import { Colors } from "../../../styles/constants";
import IconButton from "../../../Components/UI/Buttons/IconButton";

export default function AlbumsTab() {
    const {
        sheetRef: CreateAlbumRef,
        open: openCreateAlbum,
        close: dismissCreateAlbum,
    } = useBottomSheetModal();

    const {
        multiselectedItems,
        multiselectMode,
        toggle,
        deselectAll,
        setSelection,
    } = useMultiSelect<Album["id"]>();

    return (
        <View style={mainStyles.container}>
            <BackgroundImageAbsolute />
            <CustomFAB onPress={openCreateAlbum} />
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
                    <MainHeader title={"Albums"} />
                )}
                <TwoColContainerList
                    type="album"
                    toggle={toggle}
                    selectedItems={multiselectedItems}
                    multiselectMode={multiselectMode}
                />
            </ScrollView>
            <CreateAlbum ref={CreateAlbumRef} dismiss={dismissCreateAlbum} />
        </View>
    );
}

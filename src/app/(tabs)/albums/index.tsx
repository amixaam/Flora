import { setStatusBarBackgroundColor } from "expo-status-bar";
import { View } from "react-native";
import Animated, {
    runOnJS,
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import CreateAlbum from "../../../Components/BottomSheets/Album/CreateAlbum";
import CustomFAB from "../../../Components/UI/Buttons/CustomFAB";
import IconButton from "../../../Components/UI/Buttons/IconButton";
import { MainHeader } from "../../../Components/UI/Headers/MainHeader";
import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";
import { TwoColContainerList } from "../../../Components/UI/UI chunks/TwoColContainerList";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import useMultiSelect from "../../../hooks/useMultiSelect";
import { Colors } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { Album } from "../../../types/song";

export default function AlbumsTab() {
    const {
        sheetRef: CreateAlbumRef,
        open: openCreateAlbum,
        close: dismissCreateAlbum,
    } = useBottomSheetModal();

    const {
        multiselectedItems,
        toggle,
        deselectAll,
    } = useMultiSelect<Album["id"]>();

    const scrollY = useSharedValue(0);
    const handleScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;

        if (scrollY.value > 10) {
            runOnJS(setStatusBarBackgroundColor)(Colors.bg + "75", false);
        } else {
            runOnJS(setStatusBarBackgroundColor)(Colors.transparent, false);
        }
    });

    return (
        <View style={[mainStyles.container, { position: "relative" }]}>
            <BackgroundImageAbsolute />
            <CustomFAB onPress={openCreateAlbum} />
            <Animated.ScrollView onScroll={handleScroll}>
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
                />
            </Animated.ScrollView>

            <CreateAlbum ref={CreateAlbumRef} dismiss={dismissCreateAlbum} />
        </View>
    );
}

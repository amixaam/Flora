import { router, useNavigation } from "expo-router";
import { Text, TouchableNativeFeedback, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef } from "react";
import { useSongsStore } from "../../../store/songs";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlbumArt from "../../../Components/AlbumArt";
import AlbumSheet from "../../../Components/BottomSheets/AlbumSheet";
import CreateAlbum from "../../../Components/BottomSheets/CreateAlbum";
import IconButton from "../../../Components/UI/IconButton";
import { Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import { Album } from "../../../types/song";
export default function AlbumsTab() {
    const { albums, setSelectedAlbum } = useSongsStore();
    const insets = useSafeAreaInsets();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton icon="plus" onPress={handleOpenCreateAlbum} />
            ),
        });
    }, [navigation]);

    const newAlbumSheetRef = useRef<BottomSheet>(null);
    const handleOpenCreateAlbum = () => newAlbumSheetRef.current?.expand();

    const AlbumSheetRef = useRef<BottomSheet>(null);
    const handleOpenAlbumSheet = () => AlbumSheetRef.current?.expand();

    return (
        <View style={[mainStyles.container]}>
            <FlashList
                numColumns={2}
                data={albums}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    paddingTop: insets.top * 2,
                    paddingBottom: insets.bottom + Spacing.miniPlayer,
                    paddingHorizontal: Spacing.appPadding - Spacing.sm,
                }}
                estimatedItemSize={100}
                renderItem={({ item }) => (
                    <AlbumItem
                        item={item}
                        onPress={() => {
                            setSelectedAlbum(item);
                            router.push(`(tabs)/albums/${item.id}`);
                        }}
                        onLongPress={() => {
                            setSelectedAlbum(item);
                            handleOpenAlbumSheet();
                        }}
                    />
                )}
            />
            <CreateAlbum ref={newAlbumSheetRef} />
            <AlbumSheet ref={AlbumSheetRef} />
        </View>
    );
}

const AlbumItem = ({
    item,
    onPress = () => {},
    onLongPress = () => {},
}: {
    item: Album;
    onPress?: () => void;
    onLongPress?: () => void;
}) => {
    return (
        <TouchableNativeFeedback
            onPress={onPress}
            onLongPress={onLongPress}
            delayLongPress={250}
        >
            <View style={{ rowGap: Spacing.xs, margin: Spacing.sm }}>
                <AlbumArt
                    image={item.artwork}
                    style={{ width: "100%", aspectRatio: 1, borderRadius: 7 }}
                />
                <View>
                    <Text style={[textStyles.h5]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text
                        style={[{ marginTop: -Spacing.xs }, textStyles.small]}
                    >
                        {`${item.artist} • ${item.year}`}
                    </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

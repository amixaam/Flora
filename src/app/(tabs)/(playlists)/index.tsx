import { router, useNavigation } from "expo-router";
import { Text, TouchableNativeFeedback, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useRef } from "react";
import { useSongsStore } from "../../../store/songs";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlbumArt from "../../../Components/AlbumArt";
import CreatePlaylistBottomSheet from "../../../Components/BottomSheets/CreatePlaylistBottomSheet";
import PlaylistSheet from "../../../Components/BottomSheets/PlaylistSheet";
import IconButton from "../../../Components/UI/IconButton";
import { Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Playlist } from "../../../types/song";
import { SheetModalLayout } from "../../../Components/BottomSheets/SheetModalLayout";
import TsBottomSheetAddon from "../../../Components/BottomSheets/TsBottomSheetAddon";

export default function PlaylistsTab() {
    const { playlists, setSelectedPlaylist, setup } = useSongsStore();
    useEffect(() => {
        setup();
    }, []);
    const insets = useSafeAreaInsets();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton icon="plus" onPress={openCreatePlaylist} />
            ),
        });
    }, [navigation]);

    const newPlaylistRef = useRef<BottomSheetModal>(null);
    const openCreatePlaylist = () => newPlaylistRef.current?.present();
    const dismissCreatePlaylist = () => newPlaylistRef.current?.dismiss();

    const PlaylistOptionsRef = useRef<BottomSheetModal>(null);
    const openPlaylistOptions = () => PlaylistOptionsRef.current?.present();
    const dismissPlaylistOptions = () => PlaylistOptionsRef.current?.dismiss();

    const sheetModalRef = useRef<BottomSheetModal>(null);
    const openSheet = useCallback(() => {
        sheetModalRef.current?.present();
    }, []);

    const closeSheet = useCallback(() => {
        sheetModalRef.current?.dismiss();
    }, []);

    return (
        <View style={[mainStyles.container]}>
            <FlashList
                numColumns={2}
                data={playlists}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    paddingTop: insets.top * 2,
                    paddingBottom: insets.bottom + Spacing.miniPlayer,
                    paddingHorizontal: Spacing.appPadding - Spacing.sm,
                }}
                estimatedItemSize={100}
                renderItem={({ item }) => (
                    <PlaylistItem
                        item={item}
                        onPress={() => {
                            setSelectedPlaylist(item);
                            router.push(`./${item.id}`);
                        }}
                        onLongPress={() => {
                            setSelectedPlaylist(item);
                            openPlaylistOptions();
                        }}
                    />
                )}
            />
            <TouchableNativeFeedback onPress={openSheet}>
                <View>
                    <Text style={[textStyles.h5]}>Open sheet</Text>
                </View>
            </TouchableNativeFeedback>
            {/* <TsBottomSheet ref={sheetModalRef} dismiss={closeSheet} /> */}
            <TsBottomSheetAddon ref={sheetModalRef} dismiss={closeSheet} />
            {/* <CreatePlaylistBottomSheet ref={newPlaylistRef} /> */}
            <PlaylistSheet
                ref={PlaylistOptionsRef}
                dismiss={dismissPlaylistOptions}
            />
        </View>
    );
}

const PlaylistItem = ({
    item,
    onPress,
    onLongPress,
}: {
    item: Playlist;
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
                        style={[
                            {
                                marginTop: -Spacing.xs,
                            },
                            textStyles.small,
                        ]}
                    >
                        {item.songs.length === 0 ? "No" : item.songs.length}{" "}
                        song
                        {item.songs.length !== 1 && "s"}
                    </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

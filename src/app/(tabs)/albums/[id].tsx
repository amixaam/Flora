import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlbumArt from "../../../Components/AlbumArt";
import AlbumSheet from "../../../Components/BottomSheets/AlbumSheet";
import SongSheet from "../../../Components/BottomSheets/SongSheet";
import ImageBlurBackground from "../../../Components/ImageBlurBackground";
import SongListItem from "../../../Components/SongListItem";
import IconButton from "../../../Components/UI/IconButton";
import ListItemsNotFound from "../../../Components/UI/ListItemsNotFound";
import PrimaryRoundIconButton from "../../../Components/UI/PrimaryRoundIconButton";
import SecondaryRoundIconButton from "../../../Components/UI/SecondaryRoundIconButton";
import { useSongsStore } from "../../../store/songs";
import { Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { CalculateTotalDuration } from "../../../utils/FormatMillis";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";

export default function AlbumScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    if (typeof id === "undefined") return router.back();

    const { getAlbum, getSongsFromAlbum, shuffleList, addListToQueue } =
        useSongsStore();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton icon="pencil" onPress={handleEditPlaylist} />
            ),
        });
    }, [navigation]);

    const album = getAlbum(id);

    if (!album) return;

    const songs = getSongsFromAlbum(album.id);
    console.log(album);

    const editSongSheetRef = useRef<BottomSheet>(null);
    const handleEditSong = () => editSongSheetRef.current?.expand();

    const editAlbumSheetRef = useRef<BottomSheet>(null);
    const handleEditPlaylist = () => editAlbumSheetRef.current?.expand();

    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={[mainStyles.container]}>
            <ImageBlurBackground
                image={album.artwork}
                style={{ height: 520 }}
                gradientColors={[
                    "transparent",
                    "#05050655",
                    "#05050699",
                    "#050506",
                ]}
            />
            <View
                style={{
                    paddingTop: insets.top * 2,
                    padding: 16,
                    alignItems: "center",
                    rowGap: 8,
                }}
            >
                <AlbumArt
                    image={album.artwork}
                    style={{ width: 250, aspectRatio: 1, borderRadius: 7 }}
                />
                <View
                    style={{
                        marginVertical: 4,
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Text style={[textStyles.h4, { textAlign: "center" }]}>
                        {album.title}
                    </Text>
                    <Text
                        style={[
                            textStyles.text,
                            { textAlign: "center", opacity: 0.7 },
                        ]}
                    >
                        {`${album.artist} • ${album.year}`}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        flex: 1,
                        columnGap: 20,
                        alignItems: "center",
                    }}
                >
                    <SecondaryRoundIconButton
                        onPress={() => addListToQueue(songs, undefined, true)}
                        icon="play"
                    />
                    <PrimaryRoundIconButton
                        size={36}
                        onPress={() => shuffleList(songs, true)}
                    />
                    <SecondaryRoundIconButton
                        icon="pencil"
                        onPress={handleEditPlaylist}
                    />
                </View>
            </View>
            <View style={{ flex: 1, minHeight: 5 }}>
                <FlashList
                    data={songs}
                    estimatedItemSize={100}
                    ListEmptyComponent={
                        <ListItemsNotFound
                            text={`There are no songs in this playlist!`}
                            icon="music-note"
                        />
                    }
                    ListFooterComponent={
                        songs.length ? (
                            <View style={{ padding: Spacing.md }}>
                                <Text
                                    style={[
                                        textStyles.small,
                                        { textAlign: "center" },
                                    ]}
                                >
                                    {album.songs.length} songs{"  •  "}
                                    {CalculateTotalDuration(songs)}
                                </Text>
                            </View>
                        ) : null
                    }
                    contentContainerStyle={{
                        paddingBottom: insets.bottom + Spacing.miniPlayer,
                    }}
                    renderItem={({ item, index }) => (
                        <SongListItem
                            item={item}
                            index={index}
                            showNumeration={true}
                            showImage={false}
                            onLongPress={handleEditSong}
                            onPress={() => {
                                addListToQueue(songs, item, true);
                            }}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <SongSheet ref={editSongSheetRef} />
            <AlbumSheet ref={editAlbumSheetRef} />
        </ScrollView>
    );
}

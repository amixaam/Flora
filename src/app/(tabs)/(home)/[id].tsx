import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlbumArt from "../../../Components/AlbumArt";
import PlaylistSheet from "../../../Components/BottomSheets/PlaylistSheet";
import SongSheet from "../../../Components/BottomSheets/SongSheet";
import ImageBlurBackground from "../../../Components/ImageBlurBackground";
import SongListItem, {
    SongListItemProps,
} from "../../../Components/SongListItem";
import IconButton from "../../../Components/UI/IconButton";
import ListItemsNotFound from "../../../Components/UI/ListItemsNotFound";
import PrimaryRoundIconButton from "../../../Components/UI/PrimaryRoundIconButton";
import SecondaryRoundIconButton from "../../../Components/UI/SecondaryRoundIconButton";
import { useSongsStore } from "../../../store/songs";
import { IconSizes, Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { CalculateTotalDuration } from "../../../utils/FormatMillis";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Album, Playlist, Song } from "../../../types/song";
import { CombineStrings } from "../../../utils/CombineStrings";

export default function PlaylistScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    if (typeof id === "undefined") return router.back();

    const { getPlaylist, getSongsFromPlaylist, getAlbum, getSongsFromAlbum } =
        useSongsStore();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon="tune"
                    touchableOpacityProps={{
                        onPress: () => openPlaylistOptions,
                    }}
                />
            ),
        });
    }, [navigation]);

    let data: Album | Playlist | undefined = getPlaylist(id);
    let songData = getSongsFromPlaylist(id);
    if (data === undefined) {
        data = getAlbum(id);
        songData = getSongsFromAlbum(id);
    }

    if (data === undefined) {
        return <ListItemsNotFound />;
    }

    const SongOptionsRef = useRef<BottomSheetModal>(null);
    const openSongOptions = useCallback(() => {
        SongOptionsRef.current?.present();
    }, []);
    const dismissSongOptions = useCallback(() => {
        SongOptionsRef.current?.dismiss();
    }, []);

    const PlaylistOptionsRef = useRef<BottomSheetModal>(null);
    const openPlaylistOptions = useCallback(() => {
        PlaylistOptionsRef.current?.present();
    }, []);

    const dismissPlaylistOptions = useCallback(() => {
        PlaylistOptionsRef.current?.dismiss();
    }, []);

    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={[mainStyles.container]}>
            <ImageBlurBackground image={data.artwork} style={{ height: 560 }} />
            <View style={{ paddingTop: insets.top * 2.3 }} />

            <View style={{ flex: 1, gap: Spacing.appPadding }}>
                <AlbumInfo
                    data={data}
                    controlProps={{ songData, openPlaylistOptions }}
                />
                <SongList
                    songData={songData}
                    songProps={{
                        showImage: "description" in data,
                        showNumeration: "artist" in data,
                    }}
                />
            </View>

            <View
                style={{ paddingBottom: insets.bottom + Spacing.miniPlayer }}
            />

            <SongSheet ref={SongOptionsRef} dismiss={dismissSongOptions} />
            <PlaylistSheet
                ref={PlaylistOptionsRef}
                dismiss={dismissPlaylistOptions}
            />
        </ScrollView>
    );
}

type AlbumInfoProps = {
    data: Playlist | Album;
    controlProps: {
        songData: Song[];
        openPlaylistOptions: () => void;
    };
};
const AlbumInfo = ({ data, controlProps }: AlbumInfoProps) => {
    const isAlbum = "artist" in data;

    return (
        <View
            style={{
                alignItems: "center",
                gap: Spacing.md,
                paddingHorizontal: Spacing.appPadding,
            }}
        >
            <AlbumArt image={data.artwork} style={{ width: 260 }} />
            <View>
                <Text style={[textStyles.h5, { textAlign: "center" }]}>
                    {data.title}
                </Text>
                <Text
                    style={[textStyles.small, { textAlign: "center" }]}
                    numberOfLines={2}
                >
                    {isAlbum
                        ? CombineStrings([data.artist, data.year])
                        : data?.description}
                </Text>
            </View>
            <Controls {...controlProps} />
        </View>
    );
};

const Controls = ({
    songData,
    openPlaylistOptions,
}: {
    songData: Song[];
    openPlaylistOptions: () => void;
}) => {
    const { shuffleList, addListToQueue } = useSongsStore();

    return (
        <View
            style={{
                flexDirection: "row",
                flex: 1,
                columnGap: 20,
                alignItems: "center",
            }}
        >
            <IconButton
                icon="shuffle"
                touchableOpacityProps={{
                    onPress: () => shuffleList(songData, true),
                }}
            />
            <IconButton
                touchableOpacityProps={{
                    onPress: () => addListToQueue(songData, undefined, true),
                }}
                size={IconSizes.xl}
                icon="play-circle"
            />
            <IconButton
                icon="tune"
                touchableOpacityProps={{
                    onPress: openPlaylistOptions,
                }}
            />
        </View>
    );
};

type SongListProps = {
    songData: Song[];
    songProps?: Omit<SongListItemProps, "item">;
};
const SongList = ({ songData, songProps }: SongListProps) => {
    const { setSelectedSong, addListToQueue } = useSongsStore();

    return (
        <View style={{ minHeight: 5 }}>
            <FlashList
                data={songData.slice().reverse()}
                estimatedItemSize={100}
                ListEmptyComponent={
                    <ListItemsNotFound
                        text={`There are no songs in this playlist!`}
                        icon="music-note"
                    />
                }
                ListFooterComponent={
                    songData.length ? (
                        <View style={{ padding: Spacing.md }}>
                            <Text
                                style={[
                                    textStyles.small,
                                    { textAlign: "center" },
                                ]}
                            >
                                {CombineStrings([
                                    `${songData.length} songs`,
                                    CalculateTotalDuration(songData),
                                ])}
                            </Text>
                        </View>
                    ) : null
                }
                renderItem={({ item, index }) => (
                    <SongListItem
                        item={item}
                        index={index}
                        showImage={true}
                        onLongPress={() => {
                            setSelectedSong(item);
                            // openSongOptions();
                        }}
                        onPress={() => {
                            addListToQueue(songData, item, true);
                        }}
                        {...songProps}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};
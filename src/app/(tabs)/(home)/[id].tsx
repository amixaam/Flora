import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlbumArt from "../../../Components/AlbumArt";
import ContainerSheet from "../../../Components/BottomSheets/Container/ContainerSheet";
import SongSheet from "../../../Components/BottomSheets/Song/SongSheet";
import ImageBlurBackground from "../../../Components/ImageBlurBackground";
import SongListItem, {
    SongListItemProps,
} from "../../../Components/SongListItem";
import IconButton from "../../../Components/UI/IconButton";
import ListItemsNotFound from "../../../Components/UI/ListItemsNotFound";
import { useSongsStore } from "../../../store/songs";
import { IconSizes, Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Album, Playlist, Song } from "../../../types/song";
import { CombineStrings } from "../../../utils/CombineStrings";
import { CalculateTotalDuration } from "../../../utils/FormatMillis";

export default function PlaylistScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    if (typeof id === "undefined") return router.back();

    const {
        getPlaylist,
        getSongsFromPlaylist,
        getAlbum,
        getSongsFromAlbum,
        setSelectedContainer,
    } = useSongsStore();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon="tune"
                    touchableOpacityProps={{
                        onPress: openContainerOptions,
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

    const ContainerOptionsRef = useRef<BottomSheetModal>(null);
    const openContainerOptions = useCallback(() => {
        setSelectedContainer(data);
        ContainerOptionsRef.current?.present();
    }, []);

    const dismissContainerOptions = useCallback(() => {
        ContainerOptionsRef.current?.dismiss();
    }, []);

    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={[mainStyles.container]}>
            <ImageBlurBackground
                image={data.artwork}
                style={{ height: 500, top: 0 }}
                blur={15}
                gradient={{ colors: ["#050506", "#05050640", "#050506"] }}
            />
            <View style={{ paddingTop: insets.top * 2.3 }} />

            <View style={{ flex: 1, gap: Spacing.appPadding }}>
                <AlbumInfo
                    data={data}
                    controlProps={{ songData, openContainerOptions }}
                />
                <SongList
                    songData={songData}
                    songProps={{
                        showImage: "description" in data,
                        showNumeration: "artist" in data,
                    }}
                    openSongOptions={openSongOptions}
                />
            </View>

            <View
                style={{ paddingBottom: insets.bottom + Spacing.miniPlayer }}
            />

            <SongSheet ref={SongOptionsRef} dismiss={dismissSongOptions} />
            <ContainerSheet
                ref={ContainerOptionsRef}
                dismiss={dismissContainerOptions}
            />
        </ScrollView>
    );
}

type AlbumInfoProps = {
    data: Playlist | Album;
    controlProps: {
        songData: Song[];
        openContainerOptions: () => void;
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
            <View style={{ gap: Spacing.xs }}>
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
    openContainerOptions,
}: {
    songData: Song[];
    openContainerOptions: () => void;
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
                    onPress: openContainerOptions,
                }}
            />
        </View>
    );
};

type SongListProps = {
    songData: Song[];
    openSongOptions?: () => void;
    songProps?: Omit<SongListItemProps, "item">;
};
const SongList = ({
    songData,
    openSongOptions = () => {},
    songProps,
}: SongListProps) => {
    const { setSelectedSong, addListToQueue } = useSongsStore();

    return (
        <View style={{ minHeight: 5 }}>
            <FlashList
                data={songData}
                estimatedItemSize={100}
                ListEmptyComponent={
                    <ListItemsNotFound
                        text={`There are no added songs!`}
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
                        onPress={() => {
                            addListToQueue(songData, item, true);
                        }}
                        onLongPress={() => {
                            setSelectedSong(item);
                            openSongOptions();
                        }}
                        {...songProps}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

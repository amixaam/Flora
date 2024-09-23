import {
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import {
    DimensionValue,
    Easing,
    FlexAlignType,
    Text,
    View,
} from "react-native";
import TextTicker from "react-native-text-ticker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSongsStore } from "../../../store/songs";
import {
    Colors,
    IconSizes,
    SnapPoints,
    Spacing,
} from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import { BottomSheetProps } from "../../../types/other";
import { Song } from "../../../types/song";
import { CombineStrings } from "../../../utils/CombineStrings";
import { abbreviateNumber } from "../../../utils/FormatNumber";
import Pluralize from "../../../utils/Pluralize";
import SmallStatisticText from "../../UI/SmallStatisticText";
import { UISeperator } from "../../UI/UISeperator";
import { SheetModalLayout } from "../SheetModalLayout";
import { FlatList } from "react-native-gesture-handler";
import ListItemsNotFound from "../../UI/ListItemsNotFound";

const AlbumRanking = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedContainer, getAlbumRanking } = useSongsStore();

        if (!selectedContainer || !("artist" in selectedContainer)) return;

        const ranking = getAlbumRanking(selectedContainer.id);
        if (!ranking || ranking.length === 0)
            return (
                <SheetModalLayout
                    ref={ref}
                    title={`Album ranking`}
                    snapPoints={[SnapPoints.lg]}
                >
                    <ListItemsNotFound
                        text="No ranking data!"
                        icon="chart-timeline-variant-shimmer"
                    />
                </SheetModalLayout>
            );

        const largestPlayCount = ranking[0].statistics.playCount;
        const calculateWidth = (playCount: number): DimensionValue => {
            const maxWidth = 100;
            if (largestPlayCount === 0) return 0;
            return (maxWidth * playCount) / largestPlayCount;
        };

        const calculateTotalPlayTime = (songs: Song[]) => {
            const totalPlaytime = songs.reduce((total, song) => {
                const playCount = song.statistics.playCount ?? 0;
                const duration = song.duration ?? 0;
                return total + playCount * duration;
            }, 0);
            const formattedPlaytime =
                totalPlaytime > 0
                    ? Math.round((totalPlaytime / 60 / 60) * 10) / 10
                    : 0;

            return formattedPlaytime;
        };

        return (
            <SheetModalLayout
                ref={ref}
                title={`Album ranking`}
                snapPoints={[SnapPoints.lg]}
            >
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={ranking.slice(3)}
                    contentContainerStyle={{
                        gap: Spacing.md,
                        marginHorizontal: Spacing.appPadding,
                    }}
                    ListHeaderComponent={
                        <BottomSheetView
                            style={{
                                gap: Spacing.md,
                            }}
                        >
                            <TopThreeSongs songs={ranking.slice(0, 3)} />
                            <UISeperator />
                            <SmallStatisticText
                                icon="heart"
                                text={`You’ve listened to this album for a total of ${calculateTotalPlayTime(
                                    ranking
                                )} hours.`}
                            />
                            <UISeperator />
                        </BottomSheetView>
                    }
                    renderItem={({ item }) => (
                        <RankingListItem
                            song={item}
                            width={calculateWidth(item.statistics.playCount)}
                        />
                    )}
                    ListFooterComponent={
                        <View style={{ height: Spacing.xl }} />
                    }
                />
            </SheetModalLayout>
        );
    }
);

interface RankingListItemProps {
    song: Song;
    width: DimensionValue;
}

const RankingListItem = ({ song, width }: RankingListItemProps) => {
    return (
        <BottomSheetView
            style={{
                flexDirection: "row",
                gap: Spacing.sm,
                alignItems: "center",
            }}
        >
            <BottomSheetView
                style={{
                    backgroundColor: Colors.input,
                    paddingBottom: Spacing.mmd,
                    paddingTop: Spacing.mmd,
                    borderRadius: Spacing.radius,
                    minWidth: 40,
                    alignItems: "center",
                    width: width,
                }}
            >
                <Text style={textStyles.h6}>
                    {abbreviateNumber(song.statistics.playCount)}
                </Text>
            </BottomSheetView>
            <BottomSheetView
                style={{
                    flexDirection: "column",
                    gap: Spacing.xs,
                    width: "100%",
                }}
            >
                <TextTicker
                    key={song.title}
                    style={[textStyles.text]}
                    duration={12 * 1000}
                    marqueeDelay={2 * 1000}
                    easing={Easing.linear}
                    bounce={false}
                    scroll={false}
                    loop
                >
                    {song.title}
                </TextTicker>
                <Text
                    numberOfLines={1}
                    style={[textStyles.small, { opacity: 0.75 }]}
                >
                    {CombineStrings([song.artist, song.year])}
                </Text>
            </BottomSheetView>
        </BottomSheetView>
    );
};

interface TopThreeSongsProps {
    songs: Song[];
}

const TopThreeSongs = ({ songs }: TopThreeSongsProps) => {
    const FIRST_PLACE_HEIGHT = 102;
    const SECOND_PLACE_HEIGHT = 73;
    const THIRD_PLACE_HEIGHT = 55;

    return (
        <BottomSheetView style={{ gap: Spacing.md, flexDirection: "row" }}>
            <Podium
                height={SECOND_PLACE_HEIGHT}
                song={songs[1]}
                textColor={Colors.secondary}
                bgColor={Colors.primary}
            />
            <Podium
                height={FIRST_PLACE_HEIGHT}
                song={songs[0]}
                detailed={true}
                textColor={Colors.secondary}
                bgColor={Colors.badgeLegendary}
            />
            <Podium
                height={THIRD_PLACE_HEIGHT}
                song={songs[2]}
                bgColor={Colors.badgeRare}
            />
        </BottomSheetView>
    );
};

const Podium = ({
    height,
    song,
    detailed = false,
    bgColor = Colors.input,
    textColor = Colors.primary,
}: {
    height: number;
    song: Song;
    detailed?: boolean;
    bgColor?: Colors;
    textColor?: Colors;
}) => {
    const textAlignment: FlexAlignType =
        song.title.length >= 12 ? "stretch" : "center";

    return (
        <BottomSheetView
            style={{ flex: 1, gap: Spacing.sm, justifyContent: "flex-end" }}
        >
            <BottomSheetView
                style={{
                    height: height,
                    backgroundColor: bgColor,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: Spacing.radius,
                }}
            >
                {detailed && (
                    <MaterialCommunityIcons
                        name="trophy-variant"
                        size={IconSizes.md}
                        color={textColor}
                    />
                )}
                <Text style={[textStyles.h5, { color: textColor }]}>
                    {abbreviateNumber(song.statistics.playCount)}{" "}
                    {detailed &&
                        Pluralize(
                            song.statistics.playCount,
                            "play",
                            "plays",
                            false
                        )}
                </Text>
            </BottomSheetView>
            <BottomSheetView
                style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: textAlignment,
                    gap: Spacing.xs,
                    width: "100%",
                }}
            >
                <TextTicker
                    key={song.title}
                    style={[textStyles.text]}
                    duration={12 * 1000}
                    marqueeDelay={2 * 1000}
                    easing={Easing.linear}
                    bounce={false}
                    scroll={false}
                    loop
                >
                    {song.title}
                </TextTicker>
                <Text
                    numberOfLines={1}
                    style={[
                        textStyles.small,
                        { opacity: 0.75, alignSelf: "center" },
                    ]}
                >
                    {CombineStrings([song.artist, song.year])}
                </Text>
            </BottomSheetView>
        </BottomSheetView>
    );
};

export default AlbumRanking;

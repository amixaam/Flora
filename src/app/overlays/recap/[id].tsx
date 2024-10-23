import { router, useLocalSearchParams } from "expo-router";
import SheetHeader from "../../../Components/UI/Headers/SheetHeader";
import SwipeDownScreen from "../../../Components/UI/Utils/SwipeDownScreen";
import { useRecapStore } from "../../../store/recapStore";
import { RECAP_PERIOD, RecapPeriodData } from "../../../types/recap";
import {
    Easing,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import { textStyles } from "../../../styles/text";
import HumanReadableLength from "../../../utils/HumanReadableLength";
import { useSongsStore } from "../../../store/songsStore";
import { Colors, FontSize, Spacing } from "../../../styles/constants";
import { ScrollView } from "react-native-gesture-handler";
import AlbumArt from "../../../Components/UI/UI chunks/AlbumArt";
import TextTicker from "react-native-text-ticker";
import Pluralize from "../../../utils/Pluralize";

const SpecificRecapScreen = () => {
    const { id, period } = useLocalSearchParams<{
        id: string;
        period: string;
    }>();

    if (typeof id === "undefined" || typeof period === "undefined")
        return router.back();

    const { getPeriodRecap } = useRecapStore();
    const { getAlbum, getSong } = useSongsStore();

    const recapData = getPeriodRecap(period as RECAP_PERIOD, id);

    const humanReadableListeningTime = HumanReadableLength(
        recapData?.aggregates.totalListeningTime as number
    );

    const favoriteAlbum = getAlbum(
        recapData?.aggregates.topAlbums[0].albumId as string
    );

    const favoriteSong = getSong(
        recapData?.aggregates.topSongs[0].songId as string
    );

    const topSongs = recapData?.aggregates.topSongs.slice(0, 5);
    const topAlbums = recapData?.aggregates.topAlbums.slice(0, 5);

    const getTopListenedHours = (recapData: RecapPeriodData) => {
        // Get all listening patterns and combine hour counts across all days
        const hourlyTotals = new Array(24).fill(0);

        recapData?.aggregates.listeningPatterns.forEach((pattern) => {
            pattern.timesPlayed.forEach((slot, hour) => {
                hourlyTotals[hour] += slot.count;
            });
        });

        // Get top 5 hours
        const topHours = hourlyTotals
            .map((count, hour) => ({ hour, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return topHours;
    };

    const topListenedHours = getTopListenedHours(recapData as RecapPeriodData);

    return (
        <SwipeDownScreen>
            <SheetHeader title={`${id} Recap`} />

            <ScrollView
                style={{
                    paddingHorizontal: Spacing.appPadding,
                }}
                contentContainerStyle={{
                    gap: Spacing.md,
                    paddingBottom: Spacing.xl,
                }}
            >
                <Header text={"Let’s see your listening stats!"} />
                <View style={{ gap: Spacing.sm }}>
                    <View style={{ flexDirection: "row", gap: Spacing.sm }}>
                        <View style={{ gap: Spacing.sm, flex: 1 }}>
                            <BentoBox
                                text={humanReadableListeningTime.number}
                                bottomLabel={`${humanReadableListeningTime.unit} listened`}
                            />
                            <BentoBox
                                topLabel="Your most played song"
                                type="tall"
                                style={{
                                    justifyContent: "space-around",
                                }}
                            >
                                <AlbumArt
                                    image={favoriteSong?.artwork}
                                    style={{ width: "100%" }}
                                />
                                <View
                                    style={{
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: Spacing.xs,
                                        width: "100%",
                                    }}
                                >
                                    <TextTicker
                                        key={favoriteSong?.title}
                                        style={[
                                            textStyles.h6,
                                            {
                                                minWidth: 160,
                                                textAlign: "center",
                                                color: "pink",
                                            },
                                        ]}
                                        duration={12 * 1000}
                                        marqueeDelay={2 * 1000}
                                        easing={Easing.linear}
                                        bounce={false}
                                        scroll={false}
                                        loop
                                    >
                                        {favoriteSong?.title}
                                    </TextTicker>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            textStyles.small,
                                            {
                                                opacity: 0.75,
                                                alignSelf: "center",
                                            },
                                        ]}
                                    >
                                        {favoriteSong?.artist},
                                    </Text>
                                </View>
                            </BentoBox>
                        </View>
                        <View style={{ gap: Spacing.sm, flex: 1 }}>
                            <BentoBox
                                topLabel="Your favorite album"
                                type="tall"
                                style={{
                                    justifyContent: "space-around",
                                }}
                            >
                                <AlbumArt
                                    image={favoriteAlbum?.artwork}
                                    style={{ width: "100%" }}
                                />
                                <View
                                    style={{
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: Spacing.xs,
                                        width: "100%",
                                    }}
                                >
                                    <TextTicker
                                        key={favoriteAlbum?.title}
                                        style={[
                                            textStyles.h6,
                                            {
                                                minWidth: 160,
                                                textAlign: "center",
                                                color: "pink",
                                            },
                                        ]}
                                        duration={12 * 1000}
                                        marqueeDelay={2 * 1000}
                                        easing={Easing.linear}
                                        bounce={false}
                                        scroll={false}
                                        loop
                                    >
                                        {favoriteAlbum?.title}
                                    </TextTicker>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            textStyles.small,
                                            {
                                                opacity: 0.75,
                                                alignSelf: "center",
                                            },
                                        ]}
                                    >
                                        {favoriteAlbum?.artist},
                                    </Text>
                                </View>
                            </BentoBox>
                            <BentoBox
                                text={`${topListenedHours[0].hour} ${
                                    topListenedHours[0].hour >= 12 ? "PM" : "AM"
                                }`}
                                bottomLabel="most active hour"
                            />
                        </View>
                    </View>
                </View>

                <Header
                    text={`Your TOP ${Pluralize(topSongs?.length, "song")}`}
                />
                <View style={{ gap: Spacing.sm }}>
                    {topSongs?.map((song, i) => {
                        const data = getSong(song.songId);
                        if (!data) return null;

                        return (
                            <Card
                                key={i}
                                id={i}
                                title={data?.title}
                                artist={data?.artist}
                                artwork={data?.artwork as string}
                                listens={song.playCount}
                                playtime={song.playCount * data?.duration}
                            />
                        );
                    })}
                </View>
                <Header
                    text={`Your TOP ${Pluralize(topAlbums?.length, "album")}`}
                />
                <View style={{ gap: Spacing.sm }}>
                    {topAlbums?.map((album, i) => {
                        const data = getAlbum(album.albumId);
                        if (!data) return null;

                        return (
                            <Card
                                key={i}
                                id={i}
                                title={data?.title}
                                artist={data?.artist}
                                artwork={data?.artwork as string}
                                listens={album.playCount}
                                playtime={album.totalDuration}
                            />
                        );
                    })}
                </View>
                <Header text="Look at this new playlist!" />
            </ScrollView>
        </SwipeDownScreen>
    );
};

interface CardProps {
    id: number;
    title: string;
    artist: string;
    artwork: string;
    listens: number;
    playtime: number;
}

const Card = ({ id, artwork, title, artist, listens, playtime }: CardProps) => {
    const readableLength = HumanReadableLength(playtime);

    const opacity = 99 - (id * 100) / 5;
    const small = id != 0;

    const StatisticText = ({
        statistic = "",
        text = "",
    }: {
        statistic: any;
        text: string;
    }) => {
        if (statistic === "" && text === "") return;

        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    gap: Spacing.xs,
                }}
            >
                <Text style={textStyles.h6}>{statistic}</Text>
                <Text style={textStyles.text}>{text}</Text>
            </View>
        );
    };

    return (
        <View
            style={{
                flexDirection: "row",
                gap: small ? Spacing.sm : Spacing.md,
                alignItems: "center",
                backgroundColor: Colors.input + opacity,

                padding: Spacing.md,
                paddingLeft: small ? Spacing.sm : Spacing.md,
                marginHorizontal: small ? Spacing.sm : 0,

                borderRadius: Spacing.radius,
            }}
        >
            <AlbumArt image={artwork} style={{ width: small ? 48 : 96 }} />
            <View style={{ flex: 1 }}>
                <Text style={textStyles.h6} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={textStyles.text} numberOfLines={1}>
                    {artist}
                </Text>
                {!small && (
                    <>
                        <StatisticText
                            statistic={listens}
                            text={Pluralize(listens, "play", "plays", false)}
                        />
                        <StatisticText
                            statistic={readableLength.number}
                            text={readableLength.unit}
                        />
                    </>
                )}
            </View>
            {small && (
                <StatisticText
                    statistic={listens}
                    text={Pluralize(listens, "play", "plays", false)}
                />
            )}
        </View>
    );
};

const Header = ({ text = "Header" }) => (
    <Text
        style={[textStyles.h5, { textAlign: "center", marginTop: Spacing.xl }]}
    >
        {text}
    </Text>
);

const BentoBox = ({
    topLabel = "",
    bottomLabel = "",
    children,
    text = "small",
    type = "small",
    style = {},
}: {
    topLabel?: string;
    bottomLabel?: string;
    children?: React.ReactNode;
    text?: string;
    type?: "small" | "wide" | "tall" | "large";
    style?: StyleProp<ViewStyle>;
}) => {
    const labelText = (label: string) =>
        label.length ? <Text style={textStyles.text}>{label}</Text> : null;
    const content = children ? (
        children
    ) : (
        <Text style={[textStyles.h3, { color: "pink" }]}>{text}</Text>
    );

    let layoutStyle: StyleProp<ViewStyle> = styles.bentoContainer;

    switch (type) {
        case "small":
            break;
        case "tall":
            layoutStyle = [
                styles.bentoContainer,
                {
                    minHeight: styles.bentoContainer.minHeight * 2 + Spacing.sm,
                    padding: Spacing.md,
                },
            ];
            break;
    }

    return (
        <View style={[layoutStyle, style]}>
            {labelText(topLabel)}
            {content}
            {labelText(bottomLabel)}
        </View>
    );
};

const styles = StyleSheet.create({
    bentoContainer: {
        backgroundColor: Colors.input,
        minHeight: 125,
        maxHeight: "0%",
        alignItems: "center",
        justifyContent: "center",
        padding: Spacing.xl,
        borderRadius: Spacing.radius,
        flex: 1,
    },
});

export default SpecificRecapScreen;

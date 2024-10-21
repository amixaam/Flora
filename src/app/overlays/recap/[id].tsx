import { router, useLocalSearchParams } from "expo-router";
import SheetHeader from "../../../Components/UI/Headers/SheetHeader";
import SwipeDownScreen from "../../../Components/UI/Utils/SwipeDownScreen";
import { useRecapStore } from "../../../store/recapStore";
import { RECAP_PERIOD } from "../../../types/recap";
import { StyleSheet, Text, View } from "react-native";
import { textStyles } from "../../../styles/text";
import HumanReadableLength from "../../../utils/HumanReadableLength";
import { useSongsStore } from "../../../store/songsStore";
import { Colors, FontSize, Spacing } from "../../../styles/constants";
import { ScrollView } from "react-native-gesture-handler";
import AlbumArt from "../../../Components/UI/UI chunks/AlbumArt";

const SpecificRecapScreen = () => {
    const { id, period } = useLocalSearchParams<{
        id: string;
        period: string;
    }>();

    if (typeof id === "undefined" || typeof period === "undefined")
        return router.back();

    const { getPeriodRecap } = useRecapStore();
    const { getAlbum } = useSongsStore();

    const recapData = getPeriodRecap(period as RECAP_PERIOD, id);

    const humanReadableListeningTime = HumanReadableLength(
        recapData?.aggregates.totalListeningTime as number
    );

    const favoriteAlbum = getAlbum(
        recapData?.aggregates.topAlbums[0].albumId as string
    );

    return (
        <SwipeDownScreen>
            <SheetHeader title={`${id} Recap`} />

            <ScrollView
                style={{
                    paddingHorizontal: Spacing.appPadding,
                }}
            >
                <View style={{ gap: Spacing.sm }}>
                    <View style={{ flexDirection: "row", gap: Spacing.sm }}>
                        <View style={{ gap: Spacing.sm }}>
                            <View style={styles.bentoContainer}>
                                <Text
                                    style={[
                                        textStyles.h3,
                                        { color: Colors.badgeRare },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {humanReadableListeningTime.number}
                                </Text>
                                <Text style={textStyles.text}>
                                    {`${humanReadableListeningTime.unit} listened`}
                                </Text>
                            </View>

                            <View style={styles.bentoContainer}>
                                <Text
                                    style={[
                                        textStyles.h3,
                                        { color: Colors.badgeRare },
                                    ]}
                                >
                                    {humanReadableListeningTime.number}
                                </Text>
                                <Text style={textStyles.text}>
                                    {`${humanReadableListeningTime.unit} listened`}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.bentoContainer,
                                {
                                    padding: 16,
                                    justifyContent: "space-around",
                                },
                            ]}
                        >
                            <Text style={textStyles.text}>
                                Your favorite album
                            </Text>
                            <AlbumArt
                                image={favoriteAlbum?.artwork}
                                style={{ width: "100%", marginVertical: 8 }}
                            />
                            <View>
                                <Text
                                    style={[
                                        textStyles.h6,
                                        {
                                            textAlign: "center",
                                            color: Colors.badgeLegendary,
                                        },
                                    ]}
                                >
                                    {favoriteAlbum?.title}
                                </Text>
                                <Text
                                    style={[
                                        textStyles.text,
                                        { textAlign: "center" },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {favoriteAlbum?.artist}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.bentoContainer}>
                        <Text
                            style={[textStyles.h3, { color: Colors.badgeRare }]}
                        >
                            {humanReadableListeningTime.number}
                        </Text>
                        <Text style={textStyles.text}>
                            {`${humanReadableListeningTime.unit} listened`}
                        </Text>
                    </View>
                </View>
                <Text style={[textStyles.text]}>
                    {JSON.stringify(recapData?.aggregates, null, 2)}
                </Text>
            </ScrollView>
        </SwipeDownScreen>
    );
};

const styles = StyleSheet.create({
    bentoContainer: {
        backgroundColor: Colors.input,
        alignItems: "center",
        justifyContent: "center",
        padding: Spacing.xl,
        borderRadius: Spacing.radius,
        flex: 1,
    },
});

export default SpecificRecapScreen;

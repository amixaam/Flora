import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
    DailyListeningPattern,
    ExportData,
    FinishedPeriod,
    RECAP_PERIOD,
    RecapAggregates,
    RecapPeriodData,
    TopAlbum,
    TopSong,
} from "../types/recap";
import { Song } from "../types/song";
import moment from "moment";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";

interface RecapState {
    periods: Record<RECAP_PERIOD, Record<string, RecapPeriodData>>;
    lastUpdated: string;
    recapStarted: string;
    activePeriods: RECAP_PERIOD[];
}

interface RecapActions {
    setActivePeriods: (periods: RECAP_PERIOD[]) => void;
    recordPlay: (song: Song) => void;
    recordSkip: (song: Song) => void;
    getPeriodRecap: (
        period: RECAP_PERIOD,
        periodId: string
    ) => RecapPeriodData | undefined;
    getActivePeriodsData: () => Record<
        RECAP_PERIOD,
        RecapPeriodData | undefined
    >;
    getPeriodIdentifier: (date: Date, period: RECAP_PERIOD) => string;
    getFinishedPeriods: () => FinishedPeriod[];
    getClosestPeriodEndDate: () => {
        period: RECAP_PERIOD;
        endDate: Date;
        humanReadable: string;
    } | null;
    getTotalAggregate: (
        periodType: RECAP_PERIOD,
        startDate?: Date,
        endDate?: Date
    ) => RecapAggregates;

    // data
    resetRecapData: () => void;
    exportData: () => Promise<void>;
    importData: () => Promise<void>;
    validateImportData: (data: any) => boolean;
}

const initialRecapState: RecapState = {
    periods: {
        [RECAP_PERIOD.DAILY]: {},
        [RECAP_PERIOD.WEEKLY]: {},
        [RECAP_PERIOD.MONTHLY]: {},
        [RECAP_PERIOD.QUARTERLY]: {},
        [RECAP_PERIOD.YEARLY]: {},
    },
    lastUpdated: new Date().toISOString(),
    recapStarted: new Date().toISOString(),
    activePeriods: [
        RECAP_PERIOD.YEARLY,
        RECAP_PERIOD.QUARTERLY,
        RECAP_PERIOD.MONTHLY,
        RECAP_PERIOD.WEEKLY,
    ],
};

export const useRecapStore = create<RecapState & RecapActions>()(
    persist(
        (set, get) => ({
            ...initialRecapState,

            setActivePeriods: (periods) => {
                set({ activePeriods: periods });
            },

            getPeriodIdentifier: (date: Date, period: RECAP_PERIOD): string => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const quarter = Math.floor(date.getMonth() / 3) + 1;
                const week = getWeekNumber(date);

                switch (period) {
                    case RECAP_PERIOD.DAILY:
                        return `${year}-${month}-${day}`;
                    case RECAP_PERIOD.WEEKLY:
                        return `${year}-W${String(week).padStart(2, "0")}`;
                    case RECAP_PERIOD.MONTHLY:
                        return `${year}-${month}`;
                    case RECAP_PERIOD.QUARTERLY:
                        return `${year}-Q${quarter}`;
                    case RECAP_PERIOD.YEARLY:
                        return `${year}`;
                }
            },

            recordPlay: (song: Song) => {
                const date = new Date();
                const periodData = get().periods;
                const activePeriods = get().activePeriods;
                const hour = date.getHours();

                activePeriods.forEach((period) => {
                    const periodId = get().getPeriodIdentifier(date, period);
                    const currentPeriodData =
                        periodData[period][periodId] ||
                        createInitialPeriodData(date, period);

                    // song statistics
                    const songStats = currentPeriodData.songs[song.id] || {
                        songId: song.id,
                        albumId: song.albumIds[0],
                        playCount: 0,
                        skipCount: 0,
                    };

                    songStats.playCount++;
                    songStats.lastPlayed = date.toISOString();
                    currentPeriodData.songs[song.id] = songStats;

                    // aggregates
                    currentPeriodData.aggregates.playCount++;
                    currentPeriodData.aggregates.totalListeningTime +=
                        song.duration;
                    currentPeriodData.aggregates.uniqueSongs = Object.keys(
                        currentPeriodData.songs
                    ).length;

                    // listening patterns
                    const dayPattern = getDayPattern(date, currentPeriodData);
                    dayPattern.timesPlayed[hour].count++;
                    dayPattern.playCount++;

                    // update top albums and songs
                    updateTopAlbums(
                        currentPeriodData,
                        song.albumIds[0],
                        song.duration
                    );
                    updateTopSongs(currentPeriodData);

                    periodData[period][periodId] = currentPeriodData;
                });

                set({
                    periods: periodData,
                    lastUpdated: date.toISOString(),
                });
            },

            recordSkip: (song: Song) => {
                const date = new Date();
                const periodData = get().periods;
                const activePeriods = get().activePeriods;

                activePeriods.forEach((period) => {
                    const periodId = get().getPeriodIdentifier(date, period);
                    const currentPeriodData =
                        periodData[period][periodId] ||
                        createInitialPeriodData(date, period);

                    if (currentPeriodData.songs[song.id]) {
                        currentPeriodData.songs[song.id].skipCount++;
                        currentPeriodData.aggregates.skipCount++;
                    }

                    periodData[period][periodId] = currentPeriodData;
                });

                set({
                    periods: periodData,
                    lastUpdated: date.toISOString(),
                });
            },

            getPeriodRecap: (period: RECAP_PERIOD, periodId: string) => {
                return get().periods[period][periodId];
            },

            getActivePeriodsData: () => {
                const date = new Date();
                const activePeriods = get().activePeriods;
                const result: Record<
                    RECAP_PERIOD,
                    RecapPeriodData | undefined
                > = {} as any;

                activePeriods.forEach((period) => {
                    const periodId = get().getPeriodIdentifier(date, period);
                    result[period] = get().periods[period][periodId];
                });

                return result;
            },

            getFinishedPeriods: () => {
                const currentDate = new Date();
                const finishedPeriods: FinishedPeriod[] = [];
                const { periods, activePeriods } = get();

                activePeriods.forEach((periodType) => {
                    const periodData = periods[periodType];

                    Object.entries(periodData).forEach(([periodId, data]) => {
                        const endDate = new Date(data.endDate);

                        if (endDate < currentDate) {
                            finishedPeriods.push({
                                period: periodType,
                                periodId,
                                data,
                            });
                        }
                    });
                });

                return finishedPeriods.sort(
                    (a, b) =>
                        new Date(b.data.endDate).getTime() -
                        new Date(a.data.endDate).getTime()
                );
            },

            getClosestPeriodEndDate: () => {
                const currentDate = new Date();
                const { activePeriods } = get();
                let closestEnd: {
                    period: RECAP_PERIOD;
                    endDate: Date;
                    humanReadable: string;
                } | null = null;

                activePeriods.forEach((period) => {
                    const { end } = calculatePeriodDates(currentDate, period);

                    if (end > currentDate) {
                        if (!closestEnd || end < closestEnd.endDate) {
                            closestEnd = {
                                period,
                                endDate: end,
                                humanReadable: moment(end).fromNow(),
                            };
                        }
                    }
                });

                return closestEnd;
            },

            getTotalAggregate: (
                periodType: RECAP_PERIOD,
                startDate?: Date,
                endDate?: Date
            ) => {
                const { periods } = get();
                const periodData = periods[periodType];
                const start = startDate ? new Date(startDate) : new Date(0);
                const end = endDate ? new Date(endDate) : new Date();

                const totalAggregate: RecapAggregates = {
                    playCount: 0,
                    skipCount: 0,
                    totalListeningTime: 0,
                    uniqueSongs: 0,
                    topAlbums: [],
                    topSongs: [],
                    listeningPatterns: [],
                };

                const uniqueSongsSet = new Set<string>();
                const songStats = new Map<string, TopSong>();
                const albumStats = new Map<string, TopAlbum>();

                // Aggregate data from all relevant periods
                Object.entries(periodData).forEach(([_, data]) => {
                    const periodStart = new Date(data.startDate);
                    const periodEnd = new Date(data.endDate);

                    // Only include periods that overlap with our date range
                    if (periodEnd >= start && periodStart <= end) {
                        // Aggregate basic counts
                        totalAggregate.playCount += data.aggregates.playCount;
                        totalAggregate.skipCount += data.aggregates.skipCount;
                        totalAggregate.totalListeningTime +=
                            data.aggregates.totalListeningTime;

                        // Track unique songs and aggregate their stats
                        Object.entries(data.songs).forEach(
                            ([songId, stats]) => {
                                uniqueSongsSet.add(songId);

                                const existingStats = songStats.get(songId);
                                if (existingStats) {
                                    existingStats.playCount += stats.playCount;
                                    existingStats.skipCount += stats.skipCount;
                                    if (
                                        stats.lastPlayed >
                                        existingStats.lastPlayed
                                    ) {
                                        existingStats.lastPlayed =
                                            stats.lastPlayed;
                                    }
                                } else {
                                    songStats.set(songId, {
                                        songId,
                                        playCount: stats.playCount,
                                        skipCount: stats.skipCount,
                                        lastPlayed: stats.lastPlayed,
                                    });
                                }
                            }
                        );

                        // Aggregate album plays
                        data.aggregates.topAlbums.forEach(
                            ({ albumId, playCount, totalDuration }) => {
                                const existing = albumStats.get(albumId) || {
                                    albumId,
                                    playCount: 0,
                                    totalDuration: 0,
                                };

                                albumStats.set(albumId, {
                                    albumId,
                                    playCount: existing.playCount + playCount,
                                    totalDuration:
                                        existing.totalDuration + totalDuration,
                                });
                            }
                        );

                        // Merge listening patterns
                        totalAggregate.listeningPatterns.push(
                            ...data.aggregates.listeningPatterns
                        );
                    }
                });

                totalAggregate.uniqueSongs = uniqueSongsSet.size;

                totalAggregate.topAlbums = Array.from(albumStats.values())
                    .sort((a, b) => b.playCount - a.playCount)
                    .slice(0, 10);

                totalAggregate.topSongs = Array.from(songStats.values())
                    .sort((a, b) => b.playCount - a.playCount)
                    .slice(0, 10);

                return totalAggregate;
            },

            resetRecapData: () => {
                set(initialRecapState);
            },

            exportData: async () => {
                try {
                    const currentState = get();
                    const exportData: ExportData = {
                        version: "1.0.0", // Version for compatibility checking
                        exportDate: new Date().toISOString(),
                        data: {
                            periods: currentState.periods,
                            lastUpdated: currentState.lastUpdated,
                            recapStarted: currentState.recapStarted,
                            activePeriods: currentState.activePeriods,
                        },
                    };

                    // Create the export filename with timestamp
                    const timestamp = moment().format("YYYY-MM-DD-HHmmss");
                    const filename = `music-recap-export-${timestamp}.json`;

                    // Get the app's documents directory
                    const fileUri = `${FileSystem.documentDirectory}${filename}`;

                    // Write the data to a file
                    await FileSystem.writeAsStringAsync(
                        fileUri,
                        JSON.stringify(exportData, null, 2),
                        {
                            encoding: FileSystem.EncodingType.UTF8,
                        }
                    );

                    // Share the file
                    if (await Sharing.isAvailableAsync()) {
                        await Sharing.shareAsync(fileUri, {
                            mimeType: "application/json",
                            dialogTitle: "Export Music Recap Data",
                            UTI: "public.json", // for iOS
                        });
                    }
                } catch (error) {
                    console.error("Error exporting data:", error);
                    throw new Error("Failed to export recap data");
                }
            },

            importData: async () => {
                try {
                    const { status } =
                        await MediaLibrary.requestPermissionsAsync();
                    if (status !== "granted") {
                        alert(
                            "Permission to access media library was denied. To view songs, please allow access."
                        );
                        return;
                    }
                    const result = await DocumentPicker.getDocumentAsync({
                        type: "application/json",
                        copyToCacheDirectory: true,
                    });

                    if (result.assets) {
                        // Read the file content
                        const content = await FileSystem.readAsStringAsync(
                            result.assets[0].uri,
                            {
                                encoding: FileSystem.EncodingType.UTF8,
                            }
                        );

                        const importData = JSON.parse(content) as ExportData;

                        // Validate the import data
                        if (!get().validateImportData(importData)) {
                            throw new Error("Invalid import data format");
                        }

                        // Merge the imported data with existing data
                        const currentState = get();
                        const mergedPeriods: Record<
                            RECAP_PERIOD,
                            Record<string, RecapPeriodData>
                        > = { ...currentState.periods };

                        // Merge each period's data
                        Object.entries(importData.data.periods).forEach(
                            ([period, periodData]) => {
                                mergedPeriods[period as RECAP_PERIOD] = {
                                    ...mergedPeriods[period as RECAP_PERIOD],
                                    ...periodData,
                                };
                            }
                        );

                        // Update the store with merged data
                        set({
                            periods: mergedPeriods,
                            lastUpdated: new Date().toISOString(),
                            // Keep the earlier recapStarted date
                            recapStarted:
                                currentState.recapStarted <
                                importData.data.recapStarted
                                    ? currentState.recapStarted
                                    : importData.data.recapStarted,
                            // Merge active periods
                            activePeriods: Array.from(
                                new Set([
                                    ...currentState.activePeriods,
                                    ...importData.data.activePeriods,
                                ])
                            ),
                        });
                    } else {
                        throw new Error("No file selected");
                    }
                } catch (error) {
                    console.error("Error importing data:", error);
                    throw new Error("Failed to import recap data");
                }
            },

            validateImportData: (data: any): boolean => {
                // Check if the data has the required structure
                if (!data || typeof data !== "object") return false;
                if (!data.version || !data.exportDate || !data.data)
                    return false;

                const requiredKeys = [
                    "periods",
                    "lastUpdated",
                    "recapStarted",
                    "activePeriods",
                ];

                // Check if all required keys exist in the data
                for (const key of requiredKeys) {
                    if (!(key in data.data)) return false;
                }

                // Validate periods structure
                const periods = data.data.periods;
                if (typeof periods !== "object") return false;

                // Check if all period types exist
                for (const periodType of Object.values(RECAP_PERIOD)) {
                    if (!(periodType in periods)) return false;
                }

                // Validate date formats
                if (!moment(data.exportDate).isValid()) return false;
                if (!moment(data.data.lastUpdated).isValid()) return false;
                if (!moment(data.data.recapStarted).isValid()) return false;

                return true;
            },
        }),
        {
            name: "recap-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Helper functions
function createInitialPeriodData(
    date: Date,
    period: RECAP_PERIOD
): RecapPeriodData {
    const { start, end } = calculatePeriodDates(date, period);
    return {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        songs: {},
        aggregates: {
            playCount: 0,
            skipCount: 0,
            totalListeningTime: 0,
            uniqueSongs: 0,
            topAlbums: [],
            topSongs: [],
            listeningPatterns: [],
        },
    };
}

export function getFinishedPeriods(
    periods: Record<RECAP_PERIOD, Record<string, RecapPeriodData>>,
    activePeriods: RECAP_PERIOD[]
): FinishedPeriod[] {
    const currentDate = new Date();
    const finishedPeriods: FinishedPeriod[] = [];

    activePeriods.forEach((periodType) => {
        const periodData = periods[periodType];

        // Sort period IDs chronologically
        const periodIds = Object.keys(periodData).sort();

        periodIds.forEach((periodId) => {
            const data = periodData[periodId];
            const endDate = new Date(data.endDate);

            // If the period's end date is in the past, it's finished
            if (endDate < currentDate) {
                finishedPeriods.push({
                    period: periodType,
                    periodId,
                    data,
                });
            }
        });
    });

    // Sort by end date, most recent first
    return finishedPeriods.sort(
        (a, b) =>
            new Date(b.data.endDate).getTime() -
            new Date(a.data.endDate).getTime()
    );
}

function getDayPattern(
    date: Date,
    periodData: RecapPeriodData
): DailyListeningPattern {
    const dateStr = date.toISOString().split("T")[0];
    let pattern = periodData.aggregates.listeningPatterns.find(
        (p) => p.date === dateStr
    );

    if (!pattern) {
        pattern = {
            date: dateStr,
            timesPlayed: Array.from({ length: 24 }, (_, i) => ({
                hour: i,
                count: 0,
            })),
            playCount: 0,
        };
        periodData.aggregates.listeningPatterns.push(pattern);
    }

    return pattern;
}

function updateTopAlbums(
    periodData: RecapPeriodData,
    albumId: string | undefined,
    duration: number
) {
    if (!albumId) return;

    const albumIndex = periodData.aggregates.topAlbums.findIndex(
        (a) => a.albumId === albumId
    );

    if (albumIndex !== -1) {
        periodData.aggregates.topAlbums[albumIndex].playCount++;
        periodData.aggregates.topAlbums[albumIndex].totalDuration += duration;
    } else {
        periodData.aggregates.topAlbums.push({
            albumId,
            playCount: 1,
            totalDuration: duration,
        });
    }

    periodData.aggregates.topAlbums.sort((a, b) => b.playCount - a.playCount);
    if (periodData.aggregates.topAlbums.length > 10) {
        periodData.aggregates.topAlbums = periodData.aggregates.topAlbums.slice(
            0,
            10
        );
    }
}

function updateTopSongs(periodData: RecapPeriodData) {
    periodData.aggregates.topSongs = Object.values(periodData.songs)
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 10)
        .map(({ songId, playCount, skipCount, lastPlayed }) => ({
            songId,
            playCount,
            skipCount,
            lastPlayed,
        }));
}

function getWeekNumber(date: Date): number {
    const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function calculatePeriodDates(
    date: Date,
    period: RECAP_PERIOD
): { start: Date; end: Date } {
    const start = new Date(date);
    const end = new Date(date);

    switch (period) {
        case RECAP_PERIOD.DAILY:
            start.setHours(0, 0, 0, 0);

            end.setDate(end.getDate() + 1);
            end.setHours(0, 0, 0, 0);
            break;

        case RECAP_PERIOD.WEEKLY:
            // Start from beginning of week (Sunday)
            start.setDate(date.getDate() - date.getDay());
            start.setHours(0, 0, 0, 0);

            end.setDate(start.getDate() + 7);
            end.setHours(0, 0, 0, 0);
            break;

        case RECAP_PERIOD.MONTHLY:
            start.setDate(1);
            start.setHours(0, 0, 0, 0);

            // End at midnight of first day of next month
            end.setMonth(end.getMonth() + 1, 1);
            end.setHours(0, 0, 0, 0);
            break;

        case RECAP_PERIOD.QUARTERLY:
            const quarter = Math.floor(date.getMonth() / 3);
            // Start from first day of quarter
            start.setMonth(quarter * 3, 1);
            start.setHours(0, 0, 0, 0);

            // End at midnight of first day of next quarter
            end.setMonth((quarter + 1) * 3, 1);
            end.setHours(0, 0, 0, 0);
            break;

        case RECAP_PERIOD.YEARLY:
            // If we're in December, start is beginning of current year
            // If we're before December, start is beginning of previous year
            const isDecemberOrLater = date.getMonth() >= 11;
            start.setFullYear(
                isDecemberOrLater ? date.getFullYear() : date.getFullYear() - 1
            );
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);

            // End date is always December 1st at midnight
            end.setMonth(11, 1); // December 1st
            end.setHours(0, 0, 0, 0);
            break;
    }

    return { start, end };
}

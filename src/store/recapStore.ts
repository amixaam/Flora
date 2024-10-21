import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
    DailyListeningPattern,
    FinishedPeriod,
    RECAP_PERIOD,
    RecapAggregates,
    RecapPeriodData,
    TopSong,
} from "../types/recap";
import { Song } from "../types/song";
import moment from "moment";

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
    resetRecapData: () => void;
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
    activePeriods: [RECAP_PERIOD.YEARLY, RECAP_PERIOD.QUARTERLY],
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
                    updateTopAlbums(currentPeriodData, song.albumIds[0]);
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
                const albumPlayCounts = new Map<string, number>();
                const songStats = new Map<string, TopSong>();

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
                            ({ albumId, playCount }) => {
                                albumPlayCounts.set(
                                    albumId,
                                    (albumPlayCounts.get(albumId) || 0) +
                                        playCount
                                );
                            }
                        );

                        // Merge listening patterns
                        totalAggregate.listeningPatterns.push(
                            ...data.aggregates.listeningPatterns
                        );
                    }
                });

                totalAggregate.uniqueSongs = uniqueSongsSet.size;

                totalAggregate.topAlbums = Array.from(albumPlayCounts.entries())
                    .map(([albumId, playCount]) => ({ albumId, playCount }))
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
    albumId: string | undefined
) {
    if (!albumId) return;

    const albumIndex = periodData.aggregates.topAlbums.findIndex(
        (a) => a.albumId === albumId
    );
    if (albumIndex !== -1) {
        periodData.aggregates.topAlbums[albumIndex].playCount++;
    } else {
        periodData.aggregates.topAlbums.push({ albumId, playCount: 1 });
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
            end.setHours(23, 59, 59, 999);
            break;
        case RECAP_PERIOD.WEEKLY:
            start.setDate(date.getDate() - date.getDay());
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            break;
        case RECAP_PERIOD.MONTHLY:
            start.setDate(1);
            end.setMonth(end.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case RECAP_PERIOD.QUARTERLY:
            const quarter = Math.floor(date.getMonth() / 3);
            start.setMonth(quarter * 3, 1);
            end.setMonth(quarter * 3 + 3, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case RECAP_PERIOD.YEARLY:
            start.setMonth(0, 1);
            end.setMonth(11, 31);
            end.setHours(23, 59, 59, 999);
            break;
    }

    return { start, end };
}

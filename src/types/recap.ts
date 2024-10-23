interface BaseStatistics {
    playCount: number;
    skipCount: number;
}

interface SongStatistics extends BaseStatistics {
    songId: string;
    albumId?: string;
    lastPlayed: string;
}

interface TimeSlot {
    hour: number;
    count: number;
}

export interface DailyListeningPattern {
    date: string;
    timesPlayed: TimeSlot[];
    playCount: number;
}

export interface RecapAggregates extends BaseStatistics {
    totalListeningTime: number; // in milliseconds
    uniqueSongs: number;
    topAlbums: TopAlbum[];
    topSongs: TopSong[];
    listeningPatterns: DailyListeningPattern[];
}

export interface TopSong {
    songId: string;
    playCount: number;
    skipCount: number;
    lastPlayed: string;
}

export interface TopAlbum {
    albumId: string;
    playCount: number;
    totalDuration: number; // Total listening time in milliseconds
}

export interface RecapPeriodData {
    startDate: string;
    endDate: string;
    songs: Record<string, SongStatistics>; // songId -> statistics
    aggregates: RecapAggregates;
}

export enum RECAP_PERIOD {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    YEARLY = "YEARLY",
}

export interface Recap {
    periods: Record<RECAP_PERIOD, Record<string, RecapPeriodData>>; // period -> periodId -> data
    lastUpdated: string;
    recapStarted: string;
}

export interface FinishedPeriod {
    period: RECAP_PERIOD;
    periodId: string;
    data: RecapPeriodData;
}

export type PeriodIdentifier = {
    [RECAP_PERIOD.DAILY]: string; // "2024-01-01"
    [RECAP_PERIOD.WEEKLY]: string; // "2024-W01"
    [RECAP_PERIOD.MONTHLY]: string; // "2024-01"
    [RECAP_PERIOD.QUARTERLY]: string; // "2024-Q1"
    [RECAP_PERIOD.YEARLY]: string; // "2024"
};

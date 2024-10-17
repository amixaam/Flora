interface Playlist {
    readonly id: string;
    title: string;
    description: string | undefined;
    artwork: string | undefined;
    songs: string[];
    lastModified: string | undefined;
    createdAt: string;
}

interface Song {
    readonly id: string;
    albumIds: string[]; // could be in many albums, main one being 1st element

    url: string;
    duration: number;
    extension: string;

    title: string;
    artist: string;
    year: string;
    trackNumber: number | undefined;
    artwork: string | undefined;

    sampleRate: number;
    bitRate: number;
    channels: number;

    isHidden: boolean;
    isLiked: boolean;
    statistics: {
        playCount: number;
        skipCount: number;
        creationDate: string;
        lastPlayed: string | undefined;
        lastModified: string | undefined;
    };
}

export enum RECAP_PERIOD {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    YEARLY = "YEARLY",
}

// each song has its own entry per day
export interface RecapStatistics {
    date: string;
    timesPlayed: string[]; // Last time played on this date,format HH:mm:ss.

    songId: Song["id"];
    albumId: Album["id"] | undefined;

    playCount: number;
    skipCount: number;
}

export interface Recap {
    period: RECAP_PERIOD; // WEEKLY, MONTHLY, etc.
    lastUpdated: string;
    recapStarted: string;
    data: RecapStatistics[]; // Array of RecapStatistics objects
}

interface Album {
    readonly id: string;
    readonly autoCreated: boolean;

    title: string;
    artist: string;
    year: string;
    artwork: string | undefined;
    songs: string[]; // song id's
    lastModified: string | undefined;
    createdAt: string;
}

interface HistoryItem {
    song: Song["id"];
    containerId: Album["id"] | Playlist["id"] | undefined;
    date: Date;
}

interface History {
    history: HistoryItem[];
    consciousHistory: HistoryItem[];
}

export type { Song, Playlist, Album, History, HistoryItem };

interface Playlist {
    readonly id: string;
    title: string;
    description: string | undefined;
    artwork: string | undefined;
    songs: string[];
    lastModified: string | undefined;
    createdAt: string;
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

interface HistoryItem {
    song: Song["id"];
    containerId: Album["id"] | Playlist["id"] | undefined;
    date: string;
}

interface History {
    history: HistoryItem[];
    consciousHistory: HistoryItem[];
}

export type { Song, Playlist, Album, History, HistoryItem };

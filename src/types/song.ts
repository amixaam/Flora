interface Container {
    readonly id: string;
    readonly type: ContainerType;
    readonly createdAt: string;

    title: string;
    songs: string[]; // song id's
    artwork?: string;
    lastModified?: string;
}

interface Album extends Container {
    readonly type: ContainerType.ALBUM;
    readonly autoCreated: boolean;
    artist: string;
    year: string;
}

interface Playlist extends Container {
    readonly type: ContainerType.PLAYLIST;
    description?: string;
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
    trackNumber?: number;
    artwork?: string;

    sampleRate: number;
    bitRate: number;
    channels: number;

    isHidden: boolean;
    rating: number;
    statistics: {
        playCount: number;
        skipCount: number;
        creationDate: string;
        lastPlayed?: string;
        lastModified?: string;
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

export enum ContainerType {
    ALBUM = "album",
    PLAYLIST = "playlist",
}

export type { Song, Playlist, Album, History, HistoryItem };

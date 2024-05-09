interface Statistics {
    lastPlayed?: Date;
    timesPlayed: number;
    timesSkipped: number;
    
}

interface Song {
    readonly id: string;
    url: string;
    title: string;
    artist: string;
    year: string;
    artwork: string | undefined;
    duration: number;

    isHidden: boolean;
    isLiked: boolean;
    statistics: Statistics;
}

interface Playlist {
    readonly id: string;
    title: string;
    description: string | undefined;
    artwork: string | undefined;
    songs: string[];
}

interface Album {
    readonly id: string;
    title: string;
    artist: string;
    year: string;
    artwork: string | undefined;
    songs: string[];
}

export type { Song, Playlist, Album };

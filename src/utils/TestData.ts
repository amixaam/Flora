import { Album, ContainerType, Playlist, Song } from "../types/song";

export const testSongObject: Song = {
    id: "123",
    albumIds: ["A123"],
    url: "file:///examplesong.mp3",

    title: "Song 1",
    artist: "Artist 1",
    artwork: undefined,
    year: "2024",
    trackNumber: 1,

    duration: 100,
    extension: "mp3",
    sampleRate: 44100,
    bitRate: 128,
    channels: 2,

    isHidden: false,
    isLiked: false,
    statistics: {
        playCount: 0,
        skipCount: 0,
        creationDate: "2024-01-01T00:00:00.000Z",
        lastModified: "2024-01-01T00:00:00.000Z",
        lastPlayed: "2024-01-01T00:00:00.000Z",
    },
};

export const testAlbumObject: Album = {
    id: "A123",
    type: ContainerType.ALBUM,
    autoCreated: false,
    title: "Album 1",
    artist: "Artist 1",
    year: "2024",
    artwork: undefined,
    songs: ["123"],
    lastModified: "2024-01-01T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00.000Z",
};

export const testPlaylistObject: Playlist = {
    id: "P123",
    type: ContainerType.PLAYLIST,
    title: "Playlist 1",
    description: "Playlist 1 description",
    artwork: undefined,
    songs: ["123"],
    lastModified: "2024-01-01T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00.000Z",
};

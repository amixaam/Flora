import { Song } from "../types/song";

const testSongObject: Song = {
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

export default testSongObject;

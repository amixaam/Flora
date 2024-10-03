import { useSongsStore } from "../store/songs";
import { Song } from "../types/song";
import { MetadataReader } from "./MetadataReader";
import * as MediaLibrary from "expo-media-library";

export const SaveSong = async (asset: MediaLibrary.Asset) => {
    const {
        addSongs,
        createAlbum,
        addSongToAlbum,
        doesSongExist,
        getAlbumByName,
    } = useSongsStore();

    // Song already exists
    if (doesSongExist(asset.id)) return;

    const metadata = await MetadataReader(asset.uri);

    // init song object and add it to store
    const song: Song = {
        id: asset.id,
        albumIds: [],

        url: asset.uri,

        title:
            metadata.title || asset.filename.split(".").slice(0, -1).join("."),
        artist: metadata.artist || "No artist",
        year: metadata.year ? metadata.year.slice(0, 4) : "No year",
        artwork: undefined,
        duration: asset.duration,

        isLiked: false,
        isHidden: false,
        statistics: {
            creationDate: new Date().toString(),
            lastPlayed: undefined,
            playCount: 0,
            skipCount: 0,
            lastModified: undefined,
        },
    };

    addSongs([song]);

    // Add song to album, if the neccessary metadata exists
    if (metadata.album) {
        const album = getAlbumByName(metadata.album);
        if (album) {
            addSongToAlbum(album.id, song.id);
            return;
        }

        const newAlbumId = createAlbum({
            title: metadata?.album,
            artist: metadata?.artist,
            year: metadata?.year,
        });

        addSongToAlbum(newAlbumId, song.id);
    }
};

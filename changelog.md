## Testers feature requests (from v0.2.0)

-   Add new playlist button on add song to playlist bottom sheet

## Tester bugs (from v0.2.0)

-   When playlist ends, playback controlls do nothing
-   Image edit crash??
-   Undefined variable when clicking on edit button (when you havent long-pressed a song list item first)
-   Song list shenanigens

# v0.3.0 Roadmap

## New features

-   [ ] Playing queue (Add songs, playlists, albums to playing queue)
-   [ ] Background music playback
-   [ ] Albums and Singles (Album tab)
-   [ ] Last played history
-   [ ] Read audio file metadata from downloads
-   [ ] Edit specific song metadata
-   [ ] Song title (if too long) in mini player, will loop horizontally

-   [ ] Playlist, Song and Album sorting
-   [ ] "Add as single" option for songs
-   [ ] Select multiple in song lists
-   [ ] Go to Album, Artist options in song bottom sheet
-   [ ] View song statistics
-   [ ] Refresh song list function
-   [ ] Ask to update song metadata from playlist when editing playlist
-   [ ] Dynamic top bar
-   [ ] Apply audio file metadata option in bottom sheet (1 time thing)

-   [ ] TESTER REQ: Add new playlist option to add song to playlist bottom sheet
-   [ ] (backend) Variable bottom sheet sizes

## Bug fixes

-   [ ] Playback from song screen fully working
-   [ ] Song names are set appropriately (instead of file name)
-   [ ] Make bottom sheets dissapear on universal back button
-   [ ] Check for deleted audio files, and removing them from app storage
-   [ ] Remove date picker, in favor of a regular text input

-   [x] TESTER REQ: Playback controls not working when playlist ends
-   [ ] TESTER REQ: state timing, shows error for undefined or null items

## Teaks

-   [x] Aligned playlist list correctly to the app's margin
-   [x] Playback scrollbar aligns with content horizontally
-   [ ] "Shuffle play", "Edit playlist" and "Add songs to playlist" options are box shaped and at the top
-   [x] "Add to queue", "Add to playlist" and "(Un)like song" options are box shaped and at the top
-   [ ] Removed "Update songs with playlist metadata" option
-   [ ] "Delete playlist" option icon is a trash can
-   [ ] Proper item seperator in lists
-   [ ] You can't like/unlike hidden songs
-   [ ] Flip list order in playlists (descending)
-   [ ] Font styling
-   [ ] Margin error fix on tab bar when mini player is not shown

## for v0.4.0

-   [ ] (backend) Move from asyncStorage to Sqlite (sql injection safe)
-   [ ] More statistics
-   [ ] Change song order in playlists / albums

const { Pool } = require("pg");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name FROM playlists LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id WHERE playlists.id = $1 GROUP BY playlists.id`,
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(playlistQuery);
    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE songs.id = playlist_songs.song_id AND playlist_songs.playlist_id = $1`,
      values: [playlistResult.rows[0].id],
    };
    const songsResult = await this._pool.query(songsQuery);

    const result = {
      playlist: {
        ...playlistResult.rows[0],
        songs: songsResult.rows[0],
      },
    };
    return result;
  }
}

module.exports = PlaylistsService;

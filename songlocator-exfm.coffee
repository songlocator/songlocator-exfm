###

  SongLocator resolver for Ex.fm.

  2013 (c) Andrey Popp <8mayday@gmail.com>

  Based on Tomahawk YouTube resolver.

  2011 (c) Lasconic <lasconic@gmail.com>

###

((root, factory) ->
  if typeof exports == 'object'
    SongLocator = require('songlocator-base')
    module.exports = factory(SongLocator)
  else if typeof define == 'function' and define.amd
    define (require) ->
      SongLocator = require('songlocator-base')
      root.SongLocator.EXFM = factory(SongLocator)
  else
    root.SongLocator.EXFM = factory(SongLocator)

) this, ({BaseResolver, extend}) ->

  class Resolver extends BaseResolver
    name: 'exfm'

    options: extend({}, BaseResolver::options, {searchMaxResults: 11})

    resolve: (qid, track, artist, album, search = false) ->
      query = "#{track or ''} #{artist or ''}".trim()
      this.request
        url: "http://ex.fm/api/v3/song/search/#{encodeURIComponent(query)}"
        params:
          start: 0,
          results: this.options.searchMaxResults
        callback: (error, response) =>
          return if error
          return unless response.results > 0

          results = for song in response.songs
            # use soundcloud instead
            continue if song.url.indexOf("http://api.soundcloud.com") == 0
            continue if song.url.indexOf("https://api.soundcloud.com") == 0
            continue unless song.artist

            if song.title?

              dTitle = if song.title.indexOf("\n") != -1
                song.title
                  .split("\n")
                  .map((v) -> v.trim())
                  .join(' ')
              else
                song.title

              dTitle = dTitle
                  .replace("\u2013","")
                  .replace("  ", " ")
                  .replace("\u201c","")
                  .replace("\u201d","")

              if dTitle.toLowerCase().indexOf(song.artist.toLowerCase() + " -") == 0
                dTitle = dTitle.slice(song.artist.length + 2).trim()
              else if dTitle.toLowerCase().indexOf(song.artist.toLowerCase() + "-") == 0
                dTitle = dTitle.slice(song.artist.length + 1).trim()
              else if dTitle.toLowerCase() == song.artist.toLowerCase()
                continue
              else if dTitle.toLowerCase().indexOf(song.artist.toLowerCase()) == 0
                dTitle = dTitle.slice(song.artist.length).trim()


            continue if not (
              dTitle.toLowerCase().indexOf(track.toLowerCase()) != -1 \
              and (search or song.artist.toLowerCase().indexOf((artist or '').toLowerCase()) != -1) \
              or (search or artist == "" and album == ""))

            result =
              title: dTitle or title
              artist: song.artist
              album: song.album

              source: this.name
              id: song.id

              linkURL: song.sources?[0]
              imageURL: song.image.large or song.image.medium or song.image.small
              audioURL: song.url
              audioPreviewURL: undefined

              mimetype: "audio/mpeg"
              duration: undefined

          this.results(qid, if not search then [results[0]] else results)

    search: (qid, searchString) ->
      this.resolve(qid, searchString, undefined, undefined, true)

  {Resolver}

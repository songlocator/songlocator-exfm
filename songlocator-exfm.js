//@ sourceMappingURL=songlocator-exfm.map
// Generated by CoffeeScript 1.6.1
/*

  SongLocator resolver for Ex.fm.

  2013 (c) Andrey Popp <8mayday@gmail.com>

  Based on Tomahawk YouTube resolver.

  2011 (c) Lasconic <lasconic@gmail.com>
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(root, factory) {
  var SongLocator;
  if (typeof exports === 'object') {
    SongLocator = require('songlocator-base');
    return module.exports = factory(SongLocator);
  } else if (typeof define === 'function' && define.amd) {
    return define(function(require) {
      SongLocator = require('songlocator-base');
      return root.SongLocator.EXFM = factory(SongLocator);
    });
  } else {
    return root.SongLocator.EXFM = factory(SongLocator);
  }
})(this, function(_arg) {
  var BaseResolver, Resolver, extend;
  BaseResolver = _arg.BaseResolver, extend = _arg.extend;
  Resolver = (function(_super) {

    __extends(Resolver, _super);

    function Resolver() {
      return Resolver.__super__.constructor.apply(this, arguments);
    }

    Resolver.prototype.name = 'exfm';

    Resolver.prototype.options = extend({}, BaseResolver.prototype.options, {
      searchMaxResults: 11
    });

    Resolver.prototype.resolve = function(qid, track, artist, album, search) {
      var _this = this;
      if (search == null) {
        search = false;
      }
      return this.request({
        url: "http://ex.fm/api/v3/song/search/" + (encodeURIComponent(track)),
        params: {
          start: 0,
          results: !search ? 1 : this.options.searchMaxResults
        },
        callback: function(error, response) {
          var dTitle, result, results, song;
          if (error) {
            return;
          }
          if (!(response.results > 0)) {
            return;
          }
          results = (function() {
            var _i, _len, _ref, _ref1, _results;
            _ref = response.songs;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              song = _ref[_i];
              if (song.url.indexOf("http://api.soundcloud.com") === 0) {
                continue;
              }
              if (song.url.indexOf("https://api.soundcloud.com") === 0) {
                continue;
              }
              if (!song.artist) {
                continue;
              }
              if (song.title != null) {
                dTitle = song.title.indexOf("\n") !== -1 ? song.title.split("\n").map(function(v) {
                  return v.trim();
                }).join(' ') : song.title;
                dTitle = dTitle.replace("\u2013", "").replace("  ", " ").replace("\u201c", "").replace("\u201d", "");
                if (dTitle.toLowerCase().indexOf(song.artist.toLowerCase() + " -") === 0) {
                  dTitle = dTitle.slice(song.artist.length + 2).trim();
                } else if (dTitle.toLowerCase().indexOf(song.artist.toLowerCase() + "-") === 0) {
                  dTitle = dTitle.slice(song.artist.length + 1).trim();
                } else if (dTitle.toLowerCase() === song.artist.toLowerCase()) {
                  continue;
                } else if (dTitle.toLowerCase().indexOf(song.artist.toLowerCase()) === 0) {
                  dTitle = dTitle.slice(song.artist.length).trim();
                }
              }
              if (!(dTitle.toLowerCase().indexOf(track.toLowerCase()) !== -1 && (search || song.artist.toLowerCase().indexOf((artist || '').toLowerCase()) !== -1) || (search || artist === "" && album === ""))) {
                continue;
              }
              _results.push(result = {
                title: dTitle || title,
                artist: song.artist,
                album: song.album,
                source: this.name,
                id: song.id,
                linkURL: (_ref1 = song.sources) != null ? _ref1[0] : void 0,
                imageURL: song.image.large || song.image.medium || song.image.small,
                audioURL: song.url,
                audioPreviewURL: void 0,
                mimetype: "audio/mpeg",
                duration: void 0
              });
            }
            return _results;
          }).call(_this);
          return _this.results(qid, !search ? results[0] : results);
        }
      });
    };

    Resolver.prototype.search = function(qid, searchString) {
      return this.resolve(qid, searchString, void 0, void 0, true);
    };

    return Resolver;

  })(BaseResolver);
  return {
    Resolver: Resolver
  };
});

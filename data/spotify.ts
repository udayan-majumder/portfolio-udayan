/* Just the IDs. Titles and cover art are resolved live from Spotify's oEmbed
   endpoint (see app/api/spotify/route.ts), so a renamed playlist or a changed
   cover mosaic updates itself.

   To add one: Spotify → Share → Copy link, then take the ID between
   /playlist/ and the "?". */
export const playlistIds = [
  "0OK3lplJ4Uz50Zm9il0SMt",
  "4pDAVQv1KcxnmMBukdcvL6",
  "3cUpnPOCjWjTaWXBrbmYJD",
  "4FF9mhIGTA295OxQueZPKA",
  "2rjJGopZjwax2Yj6GCWSwi",
];

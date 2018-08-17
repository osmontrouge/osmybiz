module.exports = {
  NODE_ENV: '"production"',
  OSM_URL: JSON.stringify(process.env.OSM_URL),
  API_URL: JSON.stringify(process.env.API_URL) || '"/api/"',
  // oauth, default dev (aka localhost)
  OSM_OAUTH_SECRET: JSON.stringify(process.env.OSM_OAUTH_SECRET) || '"tLZgaEwwAHn1eXoc79rsDLqdAwjHCi0Lh38T7ki7"',
  OSM_OAUTH_KEY: JSON.stringify(process.env.OSM_OAUTH_KEY) || '"IRTx85wq5Mv1TT7gt6iJ1KbPJiUyMmASB8jfuRCK"',
};

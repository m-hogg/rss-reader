// Service for refreshing RSS feeds

// Accept a list of feed ids
// Parse feeds
// Add new articles to DB
// Stop iteration at first duplicate

const Feed = use('App/Models/Feed')
const parseRSS = use('App/Services/ParseRSS.js')

module.exports = async function refresh(feedIds) {
    for (let id of feedIds) {
        let { url } = await Feed.find(id)
        let res = await parseRSS(url)
        // console.log(res)
    }
}
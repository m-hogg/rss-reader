// Service for parsing RSS feeds
// feedUrl - url for the RSS feed

let Parser = require('rss-parser');
let parser = new Parser();

module.exports = async function parse (feedUrl) {
    let feed = await parser.parseURL(feedUrl);

    let articles = feed.items.map((item) => ({
        title: item.title,
        date_published: Date.parse(item.pubDate),
        description: item.contentSnippet,
        article_url: item.link,
        image_url: item.image
    }))

    return {
        title: feed.title,
        url: feedUrl,
        articles
    }
}
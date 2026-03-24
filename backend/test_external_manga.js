const mangaDexService = require('./src/services/mangaDexService');
require('dotenv').config();

async function test() {
    try {
        console.log('--- Testing Trending ---');
        console.log('--- Testing Search ---');
        const search = await mangaDexService.searchManga('One Piece', 1);
        const manga = search.data[0];
        console.log('Manga ID:', manga.id);
        console.log('Attributes:', JSON.stringify(manga.attributes.title, null, 2));

        console.log('\n--- Testing Details ---');
        const details = await mangaDexService.getMangaDetails(manga.id);
        console.log('Details Title:', JSON.stringify(details.data.attributes.title, null, 2));

        console.log('\n--- Testing Chapters ---');
        const chapters = await mangaDexService.getMangaChapters(manga.id, 0, 50);
        console.log('Chapters found:', chapters.data.length);
        const chapter = chapters.data.find(ch => ch.attributes.translatedLanguage === 'en' && parseFloat(ch.attributes.chapter) > 0) || chapters.data[0];
        console.log('Testing Chapter ID:', chapter.id);
        console.log('Chapter Num:', chapter.attributes.chapter);
        console.log('Language:', chapter.attributes.translatedLanguage);

        console.log('\n--- Testing Images ---');
        const images = await mangaDexService.getChapterImages(chapter.id);
        console.log('Image URLs Count:', images.images.length);
        console.log('Sample Image:', images.images[0]);

        console.log('\nSUCCESS: All external services verified.');
        process.exit(0);
    } catch (error) {
        console.error('TEST FAILED:', error);
        process.exit(1);
    }
}

test();

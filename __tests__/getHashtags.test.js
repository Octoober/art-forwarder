import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { getHashtags } from "../src/utils/helpers";
import { SELECTORS } from '../src/constants';

const htmlFiles = [
    'danbooru.donmai.us.html',
    'rule34.xxx.html',
];

describe('getHashtags()', () => {
    it.each(htmlFiles)('should return an array of hashtags for %s ', filename => {
        const html = fs.readFileSync(path.join(__dirname, `/html/${filename}`), 'utf-8');
        const { document } = new JSDOM(html).window;
        global.document = document;

        const result = getHashtags(SELECTORS.tags);

        expect(result).toMatchObject(
            result.map(() => expect.stringMatching(/^#[\w]+$/))
        );
    });

    it('should return an empty array if no hashtags are found', () => {
        const { document } = new JSDOM(`<li><a href="#">link</a><a href="#">example tag</a></li>`).window;
        global.document = document;

        const result = getHashtags(SELECTORS.tags);

        expect(result).toEqual([]);
    });

    it('should ignore elements without a second link', () => {
        document.body.innerHTML = `<li class="tag-type-copyright tag"><a href="#">link</a></li>`;

        const result = getHashtags(SELECTORS.tags);

        expect(result).toEqual([]);
    });
});

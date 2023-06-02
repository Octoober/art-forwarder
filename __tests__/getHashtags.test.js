import { JSDOM } from 'jsdom';
import { getHashtags } from "../src/utils/helpers";


const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
global.document = dom.window.document;
global.window = dom.window;

const mockSelectors = ['.tag-item-1', '.tag-item-2'];

describe('getHashtags()', () => {
    it('should return an array of hashtags if they are froun', () => {
        document.body.innerHTML = `<li class="tag-item-1"><a href="#">link</a><a href="#">example tag</a></li>`;

        const result = getHashtags(mockSelectors)

        expect(result).toEqual(['#example_tag'])
    });

    it('should return an empty array if no hashtags are found', () => {
        document.body.innerHTML = `<li><a href="#">link</a><a href="#">example tag</a></li>`;

        const result = getHashtags(mockSelectors);

        expect(result).toEqual([]);
    });

    it('should ignore elements without a second link', () => {
        document.body.innerHTML = `<li class="tag-item-1"><a href="#">link</a></li>`;

        const result = getHashtags(mockSelectors);

        expect(result).toEqual([]);
    });
});

import { CAPTION } from "../src/constants";
import { convertLinksToHtml } from "../src/utils/helpers";

describe('convertLinksToHtml()', () => {
    it('should convert links array to HTML string with source numbers', () => {
        const mediaGroup = [
            { sourceUrl: 'https://example_1.com/' },
            { sourceUrl: 'https://example_2.com/' },
            { sourceUrl: 'https://example_3.com/' },
        ];
        const expectedHtml = `<a href="https://example_1.com/">${CAPTION.sourcePrefix} 1</a>${CAPTION.sourceSeparator}<a href="https://example_2.com/">${CAPTION.sourcePrefix} 2</a>${CAPTION.sourceSeparator}<a href="https://example_3.com/">${CAPTION.sourcePrefix} 3</a>`;

        const result = convertLinksToHtml(mediaGroup, CAPTION.sourcePrefix, CAPTION.sourceSeparator);

        expect(result).toEqual(expectedHtml);
    });

    it('should return link with no source number if only one link is present', () => {
        const links = [{ sourceUrl: 'https://example_1.com/' }];
        const expectedHtml = `<a href="https://example_1.com/">${CAPTION.sourcePrefix}</a>`;

        const result = convertLinksToHtml(links, 'source');

        expect(result).toBe(expectedHtml);
    });

    it('should return empty string when input array is empty', () => {
        const links = [];
        const expectedHtml = '';

        const result = convertLinksToHtml(links, 'source');

        expect(result).toBe(expectedHtml);
    });
});

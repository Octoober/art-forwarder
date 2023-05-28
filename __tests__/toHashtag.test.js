import { toHashtag } from "../src/utils/helpers";

describe('toHashtag()', () => {
    it('should prefix text with # symbol', () => {
        const hashtag = toHashtag('myText');
        expect(hashtag).toMatch(/^#\w+/)
    });

    it('should replace spaces with underscores', () => {
        const hashtag = toHashtag('my text');
        expect(hashtag).toBe('#my_text');
    });

    it('should remove special characters', () => {
        const hashtag = toHashtag('My TexT!@#$%^&*()_+={}[]|\\:;\'",.<>?/`~');
        expect(hashtag).toBe('#my_text');
    });

    it('should remove perentheses and its contents', () => {
        const hashtag = toHashtag('My (text)');
        expect(hashtag).toBe('#my')
    });

    it('should convert all characters to lowercase', () => {
        const hashtag = toHashtag('My TEXT');
        expect(hashtag).toBe('#my_text');
    });

    it('should handle empty strings', () => {
        const hashtag = toHashtag('');
        expect(hashtag).toBe('#')
    });

    it('should handle only special characters', () => {
        const hashtag = toHashtag('*!$&@_^');
        expect(hashtag).toBe('#')
    });
});

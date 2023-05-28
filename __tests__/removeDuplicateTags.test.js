import { removeDuplicateTags } from "../src/utils/helpers";


describe('removeDuplicateTags()', () => {
    it('should remove duplicate tags', () => {
        const mediaGroup = [
            { id: 1, caption: 'cat dog cat' },
            { id: 2, caption: 'dog bird' },
            { id: 3, caption: 'bird cow dog' },
        ];

        const result = removeDuplicateTags(mediaGroup);
        expect(result).toEqual(['cat', 'dog', 'bird', 'cow']);
    });

    it('should only return unique tags', () => {
        const mediaGroup = [
            { id: 1, caption: 'cat cat cat' },
            { id: 2, caption: 'cat cat cat' },
            { id: 3, caption: 'cat cat cat' },
        ];

        const result = removeDuplicateTags(mediaGroup);
        expect(result).toEqual(['cat']);
    });
});

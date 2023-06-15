import { getMediaSizeByUrl } from "../src/utils/helpers";

describe('getMediaSizeByUrl()', () => {
    it('should ', async () => {
        const size = await getMediaSizeByUrl('https://nymp4.rule34.xxx//images/7078/9f62040826ee07361d95a6ca6cbfc301.mp4?8074258');
        console.log(size);
    });
});

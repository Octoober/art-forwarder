import { TelegramMediaSender } from "../src/services/TelegramMediaSender";

const mockChromeStorageData = {
    chatId: '-1001234567890',
    botToken: 'bot123456:ABCdefGHIjklMnoPQRstuVWXyz'
}

const mockMediaGroup = [
    { type: 'photo', url: 'https://example.com/medianame.jpg', caption: '', sourceUrl: [], hashtags: [] },
    { type: 'photo', url: 'https://example.com/medianame.jpg', caption: '', sourceUrl: [], hashtags: [{ title: '', tags: [] }] },
    { type: 'photo', url: 'https://example.com/medianame.jpg', caption: '', sourceUrl: [], hashtags: [] },
];

const mockRequestBody = {
    chat_id: mockChromeStorageData.chatId,
    media: [
        { type: 'photo', media: 'https://example.com/medianame.jpg', caption: '', parse_mode: 'html' },
        { type: 'photo', media: 'https://example.com/medianame.jpg', caption: '', parse_mode: 'html' },
        { type: 'photo', media: 'https://example.com/medianame.jpg', caption: '', parse_mode: 'html' },
    ],
    schedule_date: expect.any(Number)
}

describe('TelegramImageSender', () => {
    let telegramMediaSender;
    let mockFetch;

    beforeEach(() => {
        global.chrome = {
            storage: {
                sync: {
                    get: jest.fn().mockResolvedValue(mockChromeStorageData)
                }
            }
        };

        // jest.spyOn(console, 'error').mockImplementation(() => { });

        mockFetch = jest.spyOn(global, 'fetch');

        telegramMediaSender = new TelegramMediaSender();

    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('_createRequestBody()', () => {
        it('should generate a valid request body', () => {
            const requestBody = telegramMediaSender._createRequestBody(mockChromeStorageData.chatId, mockMediaGroup);
            expect(JSON.parse(requestBody)).toEqual(mockRequestBody);
        });

        it('should include unique tags in the caption', () => {
            const mediaGroup = [
                {
                    type: 'photo', url: 'https://example.com/medianame.jpg', caption: '', sourceUrl: [], hashtags: [
                        { title: 'first title', tags: ['#test_tag1', '#test_tag2', '#test_tag1'] },
                        { title: 'last title', tags: ['#test_tag1', '#test_tag2', '#test_tag2'] },
                    ]
                },
            ];
            const expectedCaption = '<i>first title:</i> #test_tag1 #test_tag2\n<i>last title:</i> #test_tag1 #test_tag2\n';
            const reqestBody = telegramMediaSender._createRequestBody(mockChromeStorageData.chatId, mediaGroup);

            expect(JSON.parse(reqestBody).media[0].caption).toEqual(expectedCaption);
        });
    });

    describe('sendMedia()', () => {
        it('should send a success notification if the media is send successfully', async () => {
            mockFetch.mockResolvedValueOnce({ ok: true });

            const expectedNotification = { level: 'success', message: expect.any(String) };

            const result = await telegramMediaSender.sendMedia(mockMediaGroup);

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining(mockChromeStorageData.botToken + '/sendMediaGroup'),
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: expect.any(String)
                }
            );
            expect(result).toEqual(expectedNotification);
        });

        it('should send a error notification if the media is send error', async () => {
            mockFetch.mockResolvedValueOnce({ ok: false });

            const expectedNotification = { level: 'error', message: expect.any(String) };

            const result = await telegramMediaSender.sendMedia(mockMediaGroup);

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining(mockChromeStorageData.botToken + '/sendMediaGroup'),
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: expect.any(String)
                }
            );
            expect(result).toEqual(expectedNotification);
        });

        it('should handel error during media sending', async () => {
            mockFetch.mockRejectedValueOnce(new Error());

            const result = await telegramMediaSender.sendMedia(mockMediaGroup);

            expect(result).toEqual({ level: 'error', message: expect.any(String) });
        });
    });
});

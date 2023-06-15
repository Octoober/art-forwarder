import { MEDIA_TYPES } from "../../../constants";
import { MediaItem } from "../../../models/MediaItem";
import { getExtensionByUrl, getHashtags } from "../../../utils/helpers";
import { MediaInfo } from "../MediaInfo";
import { selectors } from "./selectors";


export class DonmaiUsMediaInfo extends MediaInfo {
    collectMediaInfo(pageUrl) {
        const mediaElement = document.querySelector(selectors.media.join(','));
        if (!mediaElement) return null;

        const { tagName } = mediaElement;
        const mediaUrl = this.getMediaUrl(mediaElement);
        const mediaType = this.getMediaType(tagName);
        const extension = getExtensionByUrl(mediaUrl);
        const source = this.getMediaSource() ?? pageUrl;
        const hashtags = getHashtags(selectors.tags);

        return new MediaItem(
            mediaElement,
            mediaType,
            mediaUrl,
            pageUrl,
            extension,
            tagName,
            source,
            hashtags,
        );
    }

    getMediaSource() {
        return document.querySelector(selectors.source)?.href;
    }

    getMediaUrl(mediaElement) {
        return mediaElement?.src || mediaElement?.querySelector('[src]')?.src;
    }

    getMediaType(tagName) {
        const mediaTypeMap = {
            IMG: MEDIA_TYPES.PHOTO,
            VIDEO: MEDIA_TYPES.VIDEO
        };
        return mediaTypeMap[tagName] ?? null;
    }
}

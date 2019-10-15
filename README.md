# A Basic Bootstrap 4 Theme For CumulusClips

This is a stripped down theme for CumulusClips Video CMS.

## Install/Config

Many of the libraries used by this theme are packaged/installed using npm. Running the following in the cloned/downloaded theme directory should get you started:

```bash
npm install
```

### Featured Thumbnail Size

To prevent stretching of the carousel images on the landing/home page, you may need to adjust how the thumbs are encoded/generated in Admin -> Settings -> Video -> Thumbnail options:

```
-vf "scale=min(1600\,iw):trunc(ow/a/2)*2" -t 1 -r 1 -f mjpeg
```

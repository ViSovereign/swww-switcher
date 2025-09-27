import { opendir, readdir, readFile, stat } from "fs/promises";
import * as _path from "path";
import { imageSize } from "image-size";

const hyprpaperSupportedFormats = ["jpg", "jpeg", "png", "webp"];

export interface Image {
  name: string;
  fullpath: string;
  size: number;
  width: number;
  height: number;
  birthtime: string;
}

const parseImagesFromPath = async (path: string): Promise<string[]> => {
  try {
    const wallpapers = await readdir(path);
    return wallpapers.filter((w) =>
      hyprpaperSupportedFormats.includes(
        _path.extname(w).toLowerCase().replace(".", ""),
      ),
    );
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get images from provided path");
  }
};

const processImage = async (path: string): Promise<Image> => {
  try {
    const buf = await readFile(path);
    const dimensions = imageSize(buf);
    const stats = await stat(path);

    return {
      width: dimensions.width,
      height: dimensions.height,
      birthtime: stats.birthtime.toLocaleString(),
      // MB
      size: stats.size / (1024 * 1024),
      fullpath: path,
      name: _path.basename(path),
    };
  } catch (e) {
    console.error(e);
    throw new Error("Failed to process image");
  }
};

export const getImagesFromPath = async (path: string): Promise<Image[]> => {
  try {
    const imagesPaths = await parseImagesFromPath(path);
    const images = await Promise.all(
      imagesPaths.map((i) => processImage(_path.join(path, i))),
    );

    return images;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get images from provided path");
  }
};

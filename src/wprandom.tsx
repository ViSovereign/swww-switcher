import { showToast, Toast, getPreferenceValues } from "@vicinae/api";
import { getImagesFromPath, Image } from "./utils/image";
import { setWallpaper, toggleVicinae, callColorGen } from "./utils/hyprland";

export default async function RandomWallpaper() {
  const path: string = getPreferenceValues().wallpaperPath;
  const swwwTransition: string = getPreferenceValues().transitionType;
  const colorGen: string = getPreferenceValues().colorGenTool;

  try {
    await showToast({
      title: "Selecting random wallpaper...",
      style: Toast.Style.Animated,
    });

    const wallpapers: Image[] = await getImagesFromPath(path);

    if (wallpapers.length === 0) {
      await showToast({
        title: "No wallpapers found",
        message: `No images found in '${path}'`,
        style: Toast.Style.Failure,
      });
      return;
    }

    // Randomly select an image
    const randomIndex = Math.floor(Math.random() * wallpapers.length);
    const selectedWallpaper = wallpapers[randomIndex];

    setWallpaper(selectedWallpaper.fullpath, swwwTransition);
    toggleVicinae();
    if (colorGen !== "none") {
      callColorGen(selectedWallpaper.fullpath, colorGen);
    }

    await showToast({
      title: `Choose '${selectedWallpaper.name}' as wallpaper`,
      message: `Set '${selectedWallpaper.name}' as wallpaper`,
      style: Toast.Style.Success,
    });
  } catch (error) {
    await showToast({
      title: "Failed to set random wallpaper",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      style: Toast.Style.Failure,
    });
  }
}

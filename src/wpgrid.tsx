import React, { useEffect, useState } from "react";
import {
  ActionPanel,
  Action,
  Grid,
  showToast,
  Toast,
  getPreferenceValues,
} from "@vicinae/api";
import { getImagesFromPath, Image } from "./utils/image";
import { setWallpaper, toggleVicinae, callColorGen } from "./utils/hyprland";

export default function DisplayGrid() {
  const path: string = getPreferenceValues().wallpaperPath;
  const swwwTransition: string = getPreferenceValues().transitionType || "fade";
  const swwwSteps: number =
    parseInt(getPreferenceValues().transitionSteps) || 90;
  const swwwDuration: number =
    parseInt(getPreferenceValues().transitionDuration) || 3;
  const colorGen: string = getPreferenceValues().colorGenTool || "none";
  const gridRows = parseInt(getPreferenceValues().gridRows) || 4;
  type Preferences = {
    toggleVicinaeSetting: boolean;
    showImageDetails: boolean;
  };
  const preferences = getPreferenceValues<Preferences>();

  const [wallpapersPath, setWallpapersPath] = useState<string | null>(null);
  const [wallpapers, setWallpapers] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getImagesFromPath(path)
      .then((ws) => {
        setIsLoading(false);
        setWallpapers(ws);
      })
      .catch((e) => {
        showToast({
          title: e.message,
          style: Toast.Style.Failure,
        });
        setIsLoading(false);
      });
  }, [wallpapersPath]);

  return (
    <Grid
      searchBarPlaceholder="Filter wallpapers..."
      columns={gridRows}
      aspectRatio="16/9"
      fit={Grid.Fit.Fill}
      isLoading={false}
    >
      <Grid.Section
        title={
          isLoading
            ? `Loading images in '${path}'...`
            : `Showing images from '${path}'`
        }
      >
        {isLoading
          ? Array.from({ length: gridRows * 3 }).map((_, i) => (
              <Grid.Item
                key={i}
                content={{ source: "loading.png" }}
                title="Loading..."
                subtitle={
                  preferences.showImageDetails ? `420x245 • 3.1 KB` : undefined
                }
              />
            ))
          : wallpapers.map((w) => (
              <Grid.Item
                key={w.fullpath}
                content={{ source: w.fullpath }}
                title={w.name}
                {...(preferences.showImageDetails && {
                  subtitle: `${w.width}x${w.height} • ${w.size.toFixed(2)} MB`,
                  accessories: [
                    { text: `${w.width}x${w.height}` },
                    { text: `${w.size.toFixed(2)} MB` },
                  ],
                })}
                actions={
                  <ActionPanel>
                    <Action
                      title={`Set '${w.name}'`}
                      onAction={() => {
                        setWallpaper(
                          w.fullpath,
                          swwwTransition,
                          swwwSteps,
                          swwwDuration,
                        );
                        if (preferences.toggleVicinaeSetting) {
                          toggleVicinae();
                        }
                        if (colorGen !== "none") {
                          callColorGen(w.fullpath, colorGen);
                        }
                      }}
                    />
                  </ActionPanel>
                }
              />
            ))}
      </Grid.Section>
    </Grid>
  );
}

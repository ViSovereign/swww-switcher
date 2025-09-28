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
  const swwwTransition: string = getPreferenceValues().transitionType;
  const colorGen: string = getPreferenceValues().colorGenTool;

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
      columns={4}
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
          ? Array.from({ length: 12 }).map((_, i) => (
              <Grid.Item
                key={i}
                content={{ source: "loading.png" }}
                title="Loading..."
              />
            ))
          : wallpapers.map((w) => (
              <Grid.Item
                key={w.fullpath}
                content={{ source: w.fullpath }}
                title={w.name}
                actions={
                  <ActionPanel>
                    <Action
                      title={`Set '${w.name}'`}
                      onAction={() => {
                        setWallpaper(w.fullpath, swwwTransition);
                        toggleVicinae();
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

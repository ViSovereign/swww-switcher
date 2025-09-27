import React, { useEffect, useState } from "react";
import {
  ActionPanel,
  Action,
  Grid,
  showToast,
  Icon,
  Toast,
  LocalStorage,
  Detail,
  getPreferenceValues,
} from "@vicinae/api";
import { getImagesFromPath, Image } from "./utils/image";
import { setWallpaper, toggleVicinae, callColorGen } from "./utils/hyprland";

export default function ListDetail() {
  const path: string = getPreferenceValues().wallpaperPath;
  const swwwTransition: string = getPreferenceValues().transitionType;
  const colorGen: string = getPreferenceValues().colorGenTool;
  const [wallpapersPath, setWallpapersPath] = useState<string | null>(null);
  const [wallpapers, setWallpapers] = useState<Image[]>([]);

  useEffect(() => {
    getImagesFromPath(path)
      .then((ws) => {
        setWallpapers(ws);
      })
      .catch((e) => {
        showToast({
          title: e.message,
          style: Toast.Style.Failure,
        });
      });
  }, [wallpapersPath]);

  return (
    <Grid
      searchBarPlaceholder={"Search wallpapers..."}
      columns={4}
      aspectRatio={"16/9"}
      fit={Grid.Fit.Fill}
    >
      <Grid.Section title={"Wallpapers from '" + path + "'"}>
        {wallpapers.map((w) => (
          <Grid.Item
            key={w.fullpath}
            content={{ source: w.fullpath }}
            icon={Icon.Image}
            title={w.name}
            actions={
              <ActionPanel>
                <Action
                  title={"Set '" + w.name + "'"}
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

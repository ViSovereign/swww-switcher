import { exec } from "child_process";

export const setWallpaper = (
  path: string,
  transition: string,
  steps: number,
  seconds: number,
): void => {
  exec(
    `swww img ${path} -t ${transition} --transition-step ${steps} --transition-duration ${seconds}`,
  );
};

export function setWallpaperOnMonitor(
  imagePath: string,
  monitorName: string,
  transition: string,
  steps: string,
  duration: string,
) {
  const command = `swww img "${imagePath}" --outputs "${monitorName}" --transition-type ${transition} --transition-step ${steps} --transition-duration ${duration}`;
  exec(command, (error) => {
    if (error) {
      console.error(`Error setting wallpaper on ${monitorName}:`, error);
    }
  });
}

export const callColorGen = (path: string, ColorGen: string): void => {
  switch (ColorGen.toLowerCase()) {
    case "matugen":
      exec(`matugen image ${path}`);
      break;

    case "pywal":
      exec(`wal -i ${path}`);
      break;

    case "wpgtk":
      exec(`wpg -s ${path}`);
      break;

    case "schemer2":
      exec(`schemer2 ${path}`);
      break;

    case "colorz":
      exec(`colorz ${path}`);
      break;

    case "haishoku":
      exec(
        `python -c "from haishoku.haishoku import Haishoku; Haishoku.loadHaishoku('${path}')"`,
      );
      break;

    default:
      console.warn(`Unknown color generator: ${ColorGen}.`);
      break;
  }
};

export const toggleVicinae = (): void => {
  exec(`vicinae vicinae://toggle`);
};

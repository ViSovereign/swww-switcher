import { exec, execSync } from "child_process";

import { showToast, Toast } from "@raycast/api";

export async function omniCommand(
  path: string,
  monitor: string,
  transition: string,
  steps: number,
  duration: number,
  apptoggle: boolean,
  colorApp: string,
) {
  let success: boolean;

  if (monitor === "ALL") {
    success = await setWallpaper(path, transition, steps, duration);
  } else {
    success = await setWallpaperOnMonitor(
      path,
      monitor,
      transition,
      steps,
      duration,
    );
  }

  if (success) {
    if (apptoggle) {
      toggleVicinae();
    }
    if (colorApp !== "none") {
      const colorGenSuccess = await callColorGen(path, colorApp);

      if (colorGenSuccess) {
        showToast({
          style: Toast.Style.Success,
          title: "Wallpaper set, colors generated!",
        });
      } else {
        showToast({
          style: Toast.Style.Failure,
          title: "Color generation failed",
        });
      }
    }
  } else {
    showToast({
      style: Toast.Style.Failure,
      title: "ERROR: Check swww-daemon status",
      message:
        "Make sure swww is installed and its daemon is running (swww-daemon).",
    });
  }
}

export const setWallpaper = async (
  path: string,
  transition: string,
  steps: number,
  seconds: number,
): Promise<boolean> => {
  try {
    execSync("swww query", { stdio: "pipe" });

    return await new Promise<boolean>((resolve) => {
      exec(
        `swww img ${path} -t ${transition} --transition-step ${steps} --transition-duration ${seconds}`,
        (error) => {
          if (error) {
            resolve(false);
          } else {
            resolve(true);
          }
        },
      );
    });
  } catch (error) {
    return false;
  }
};

export const setWallpaperOnMonitor = async (
  path: string,
  monitorName: string,
  transition: string,
  steps: number,
  seconds: number,
): Promise<boolean> => {
  try {
    execSync("swww query", { stdio: "pipe" });

    return await new Promise<boolean>((resolve) => {
      exec(
        `swww img ${path} --outputs "${monitorName}" -t ${transition} --transition-step ${steps} --transition-duration ${seconds}`,
        (error) => {
          if (error) {
            resolve(false);
          } else {
            resolve(true);
          }
        },
      );
    });
  } catch (error) {
    return false;
  }
};

export const callColorGen = async (
  path: string,
  ColorGen: string,
): Promise<boolean> => {
  let command: string;

  switch (ColorGen.toLowerCase()) {
    case "matugen":
      command = `matugen image ${path}`;
      break;

    case "pywal":
      command = `wal -i ${path}`;
      break;

    case "wpgtk":
      command = `wpg -s ${path}`;
      break;

    case "schemer2":
      command = `schemer2 ${path}`;
      break;

    case "colorz":
      command = `colorz ${path}`;
      break;

    case "haishoku":
      command = `python -c "from haishoku.haishoku import Haishoku; Haishoku.loadHaishoku('${path}')"`;
      break;

    default:
      console.warn(`Unknown color generator: ${ColorGen}.`);
      return false;
  }

  // Execute the command and check for errors
  return await new Promise<boolean>((resolve) => {
    exec(command, (error) => {
      if (error) {
        console.error(`Color generator failed: ${error.message}`);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

export const callColorGen2 = (path: string, ColorGen: string): void => {
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

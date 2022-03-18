import * as Util from "./util.js";

export enum GenerationShape
{
    Box = 0,
    Circle,
    Regular,
    Random
}

export enum MouseMode
{
    Grab = 0,
    Force
}

const rangeRange: Util.Pair<number, number> = { p1: 0.0, p2: 100.0 };

// Settings
export const Settings = {
    width: 1280,
    height: 720,
    clipWidth: 12.8,
    clipHeight: 7.2,
    paused: false,
    rangeValue: 50,
    checked: false
}

// Remove the default pop-up context menu
let cvs = document.querySelector("#canvas") as HTMLCanvasElement;
cvs.oncontextmenu = (e) =>
{
    e.preventDefault();
    e.stopPropagation();
}

const range = document.querySelector("#range")! as HTMLInputElement;
range.value = String(Util.map(Settings.rangeValue, rangeRange.p1, rangeRange.p2, 0, 100));
const rangeLabel = document.querySelector("#rangelabel")! as HTMLLabelElement;
rangeLabel.innerHTML = String(Settings.rangeValue) + "%";
range.addEventListener("input", () =>
{
    let mappedValue = Util.map(Number(range.value), 0, 100, rangeRange.p1, rangeRange.p2);
    mappedValue = Math.trunc(mappedValue);
    rangeLabel.innerHTML = String(mappedValue) + "%";

    updateSetting("range", mappedValue);
});

const check = document.querySelector("#check")! as HTMLInputElement;
check.checked = Settings.checked;
check.addEventListener("click", () => { Settings.checked = check.checked; });

export function updateSetting(id: string, content?: any)
{
    switch (id)
    {
        case "pause":
            Settings.paused = !Settings.paused;
            break
        case "range":
            Settings.rangeValue = content;
            break;
        default:
            break;
    }
}
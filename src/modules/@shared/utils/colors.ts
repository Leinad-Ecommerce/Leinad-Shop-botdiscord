import { ColorResolvable } from "discord.js"

type CustomColors = {
    primary: ColorResolvable;
    invisible: ColorResolvable;
};

const colors: Partial<CustomColors> = {
    primary: "#00ffff",
    invisible: "#000000"
}

export { colors }
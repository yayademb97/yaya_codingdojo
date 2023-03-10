"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Date: 2020-02-20 22:15:07
 * @LastEditTime: 2020-02-21 00:50:33
 */
/*
 * @Date: 2020-02-20 22:15:07
 * @LastEditTime: 2020-02-21 00:35:48
 */
const vscode = require("vscode");
const constant_1 = require("./constant");
/// 颜色提供
const convertInt2Hex = (int) => {
    return Math.ceil(int * 255).toString(16).padStart(2, "0");
};
const color2JColorCode = (color) => {
    if (color instanceof vscode.Color) {
        let r = color.red;
        let g = color.green;
        let b = color.blue;
        let a = color.alpha;
        let colorCodeString = convertInt2Hex(a) + convertInt2Hex(r) + convertInt2Hex(g) + convertInt2Hex(b);
        return colorCodeString;
    }
    return "00000000";
};
const color2ColorClassColorCode = (color) => {
    if (color instanceof vscode.Color) {
        let r = color.red;
        let g = color.green;
        let b = color.blue;
        let a = color.alpha;
        let colorCodeString = "" + Math.ceil(r * 255) + "," + Math.ceil(g * 255) + "," + Math.ceil(b * 255) + "," + Math.ceil(a * 255);
        return colorCodeString;
    }
    return "0,0,0,0";
};
class HexDocumentColorProvider {
    /// 颜色改变到文档
    provideDocumentColors(document, token) {
        let lineCount = document.lineCount;
        let colors = new Array();
        // new RegExp(/\|[cC][\da-fA-F]{8}.+?\|[rR]/, "g")
        let colorReg = new RegExp(/\|[cC][\da-fA-F]{8}/, "g");
        for (let i = 0; i < lineCount; i++) {
            let lineText = document.lineAt(i).text;
            let colotSet = lineText.match(colorReg);
            let posstion = 0;
            if (colotSet) {
                colotSet.forEach(x => {
                    posstion = lineText.indexOf(x, posstion);
                    let range = new vscode.Range(i, posstion, i, posstion + x.length);
                    let a = Number.parseInt("0x" + lineText.substr(posstion + 2, 2)) / 255;
                    let r = Number.parseInt("0x" + lineText.substr(posstion + 4, 2)) / 255;
                    let g = Number.parseInt("0x" + lineText.substr(posstion + 6, 2)) / 255;
                    let b = Number.parseInt("0x" + lineText.substr(posstion + 8, 2)) / 255;
                    colors.push(new vscode.ColorInformation(range, new vscode.Color(r, g, b, a)));
                    posstion += x.length;
                });
            }
        }
        return colors;
    }
    /// 文档改变到颜色
    provideColorPresentations(color, context, token) {
        let r = color.red;
        let g = color.green;
        let b = color.blue;
        let a = color.alpha;
        let document = context.document;
        let range = context.range;
        let documentText = document.getText(range);
        return [new vscode.ColorPresentation(`${documentText.substr(0, 2)}${color2JColorCode(new vscode.Color(r, g, b, a))}${documentText.substring(10)}`)];
    }
}
class ColorDocumentColorProvider {
    /// 颜色改变到文档
    provideDocumentColors(document, token) {
        let lineCount = document.lineCount;
        let colors = new Array();
        let colorReg = new RegExp(/color\(((\d+)(,\d+){3})\)/, "g");
        for (let i = 0; i < lineCount; i++) {
            let lineText = document.lineAt(i).text;
            let colotSet = lineText.match(colorReg);
            let posstion = 0;
            if (colotSet) {
                colotSet.forEach(x => {
                    let nums = x.match(new RegExp(/(\d+),(\d+),(\d+),(\d+)/));
                    posstion = lineText.indexOf(x, posstion);
                    let range = new vscode.Range(i, posstion, i, posstion + x.length);
                    let r = Number.parseInt(nums ? nums[1] : "255") / 255;
                    let g = Number.parseInt(nums ? nums[2] : "255") / 255;
                    let b = Number.parseInt(nums ? nums[3] : "255") / 255;
                    let a = Number.parseInt(nums ? nums[4] : "255") / 255;
                    colors.push(new vscode.ColorInformation(range, new vscode.Color(r, g, b, a)));
                    posstion += x.length;
                });
            }
        }
        return colors;
    }
    /// 文档改变到颜色
    provideColorPresentations(color, context, token) {
        let r = color.red;
        let g = color.green;
        let b = color.blue;
        let a = color.alpha;
        let document = context.document;
        let range = context.range;
        return [new vscode.ColorPresentation(`color(${color2ColorClassColorCode(new vscode.Color(r, g, b, a))})`)];
    }
}
constant_1.languages.forEach(language => {
    // if (language !== "jass" && language !== "wurst"){
    vscode.languages.registerColorProvider(language, new HexDocumentColorProvider);
    // }
    if (language !== "wurst" && language !== "ini") {
        vscode.languages.registerColorProvider(language, new ColorDocumentColorProvider);
    }
});
//# sourceMappingURL=document-color-provider.js.map
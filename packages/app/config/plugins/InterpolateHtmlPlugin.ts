/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { Compiler } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

interface IData {
  html: string;
  headTags: HtmlWebpackPlugin.HtmlTagObject[];
  bodyTags: HtmlWebpackPlugin.HtmlTagObject[];
  outputName: string;
  plugin: HtmlWebpackPlugin;
}

const replaceKeyToValueInHtml = (data: IData) => (keyAndValue: string[]) => {
  const [key, value] = keyAndValue;
  data.html = data.html.replace(new RegExp(`%${key}%`, "g"), value);
};

class CustomInterpolateHtmlPlugin {
  private replacements: Record<string, string>;

  constructor(replacements: Record<string, string>) {
    this.replacements = replacements;
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap("CustomInterpolateHtmlPlugin", (compilation: any) => {
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tap("CustomInterpolateHtmlPlugin", (data: any) => {
        Object.entries(this.replacements).forEach(replaceKeyToValueInHtml(data));
        return data;
      });
    });
  }
}

export default CustomInterpolateHtmlPlugin;

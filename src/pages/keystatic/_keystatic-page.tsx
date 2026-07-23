import { makePage } from "@keystatic/astro/ui";
import config from "../../../keystatic.config";

// 单独导出组件，Astro 才能识别它是 React 组件并用 client:only 渲染
export const Keystatic = makePage(config);

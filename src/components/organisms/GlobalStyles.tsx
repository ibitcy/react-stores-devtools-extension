/* @jsx jsx */
import { css, Global, jsx } from "@emotion/core";
import * as React from "react";

export const GlobalStyles: React.FC<{}> = () => {
  return <Global styles={globalsTheme[chrome.devtools.panels.themeName]} />;
};

const globalsTheme = {
  default: css`
    :root {
      --text-primary-color: rgb(27, 82, 201);
      --text-fade-color: rgb(136, 136, 136);
      --text-base-color: rgb(92, 92, 92);
      --text-inverse: white;

      --bg-hover-color: rgb(222, 238, 254);
      --border-color: rgb(208, 208, 208);
      --border: 1px solid var(--border-color);
      --bg-base-color: rgb(243, 243, 243);
      --border-faded-color: rgb(208, 208, 208);
      --bg-dark-color: white;
      --bg-tab-hover-color: rgb(234, 234, 234);
      --bg-inverse: white;

      --hover-color: rgb(36, 112, 229);
      --hover-faded-color: rgb(241, 246, 253);

      --code-grey: rgb(129, 129, 129);
      --code-blue: rgb(35, 0, 204);
      --code-red: rgb(207, 77, 77);
      --code-value: rgb(136, 18, 144);

      --bg-highlight-color: rgba(208, 232, 251);
      --border-highlight-color: rgba(69, 112, 241);
      --box-bg-color: rgb(65, 134, 250);
    }
  `,
  dark: css`
    :root {
      --text-primary-color: #5fadd2;
      --text-fade-color: rgb(136, 136, 136);
      --text-base-color: rgb(182, 190, 200);

      --bg-hover-color: rgb(38, 44, 54);
      --border-color: rgb(82, 82, 82);
      --border: 1px solid var(--border-color);
      --bg-base-color: rgb(51, 51, 51);
      --border-faded-color: rgb(60, 60, 60);
      --bg-dark-color: rgb(36, 36, 36);
      --bg-tab-hover-color: black;
      --bg-inverse: white;

      --hover-color: rgb(21, 98, 154);
      --hover-faded-color: rgb(52, 58, 68);

      --code-grey: rgb(127, 127, 127);
      --code-blue: rgb(150, 125, 247);
      --code-red: rgb(232, 68, 66);
      --code-value: rgb(150, 125, 207);

      --bg-highlight-color: rgba(52, 113, 52);
      --border-highlight-color: rgba(53, 204, 110);
      --box-bg-color: #a97a34;
    }
  `
};

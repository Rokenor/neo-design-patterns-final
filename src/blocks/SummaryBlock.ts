/**
 * Блок відображення короткого опису (Summary) резюме.
 */

import { ResumeModel } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class SummaryBlock implements IBlock {
  constructor(private d: ResumeModel["summary"]) {}

  render(): HTMLElement {
    const el = document.createElement("section");
    el.className = "section summary";

    const h2 = document.createElement("h2");
    h2.textContent = "Summary";

    const p = document.createElement("p");
    p.textContent = this.d.text;

    el.append(h2, p);
    return el;
  }
}

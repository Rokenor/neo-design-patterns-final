/**
 * Блок відображення навичок резюме, згрупованих за категоріями.
 */

import { Skills } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

const CATEGORY_LABELS: Record<keyof Skills, string> = {
  core: "Core",
  tools: "Tools",
  languages: "Languages",
};

export class SkillsBlock implements IBlock {
  constructor(private d: Skills) {}

  render(): HTMLElement {
    const sec = document.createElement("section");
    sec.className = "section skills";

    const h2 = document.createElement("h2");
    h2.textContent = "Skills";
    sec.appendChild(h2);

    const list = document.createElement("ul");
    list.className = "skills-list";

    for (const [category, values] of Object.entries(this.d) as [
      keyof Skills,
      string[]
    ][]) {
      if (!values || values.length === 0) continue;

      const li = document.createElement("li");
      const label = document.createElement("strong");
      label.textContent = `${CATEGORY_LABELS[category] ?? category}: `;
      li.append(label, values.join(", "));
      list.appendChild(li);
    }

    sec.appendChild(list);
    return sec;
  }
}

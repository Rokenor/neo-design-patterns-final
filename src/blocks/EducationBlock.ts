/**
 * Блок відображення освіти в резюме. Приймає масив записів про освіту
 * та рендерить їх під єдиним заголовком секції.
 */

import { Education } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class EducationBlock implements IBlock {
  constructor(private items: Education[]) {}

  render(): HTMLElement {
    const el = document.createElement("section");
    el.className = "section education";

    const h2 = document.createElement("h2");
    h2.textContent = "Education";
    el.appendChild(h2);

    for (const edu of this.items) {
      const item = document.createElement("div");
      item.className = "education-item";

      const heading = document.createElement("h3");
      heading.textContent = `${edu.degree}, ${edu.field}`;

      const details = document.createElement("p");
      details.textContent = `${edu.institution} · ${edu.graduation}`;

      item.append(heading, details);
      el.appendChild(item);
    }

    return el;
  }
}

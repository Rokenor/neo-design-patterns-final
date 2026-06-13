/**
 * Патерн Composite (Компоновщик).
 *
 * ExperienceBlock — контейнерний вузол: він рендерить секцію Experience
 * і рекурсивно додає дочірні ProjectBlock (листові вузли). Кожен проєкт
 * з прапорцем isRecent обгортається у HighlightDecorator, який додає
 * візуальне виділення, не змінюючи логіки рендеру самого проєкту.
 */

import { Experience } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";
import { ProjectBlock } from "./ProjectBlock";
import { HighlightDecorator } from "../decorators/HighlightDecorator";

export class ExperienceBlock implements IBlock {
  constructor(private items: Experience[]) {}

  render(): HTMLElement {
    const container = document.createElement("section");
    container.className = "section experience";

    const h2 = document.createElement("h2");
    h2.textContent = "Experience";
    container.appendChild(h2);

    for (const exp of this.items) {
      container.appendChild(this.renderItem(exp));
    }

    return container;
  }

  /** Рендерить одну позицію разом з її дочірніми проєктами. */
  private renderItem(exp: Experience): HTMLElement {
    const item = document.createElement("div");
    item.className = "experience-item";

    const heading = document.createElement("h3");
    heading.textContent = `${exp.position} — ${exp.company}`;

    const period = document.createElement("p");
    period.className = "period";
    period.textContent = `${exp.start} – ${exp.end}`;

    item.append(heading, period);

    // Composite: дочірні ProjectBlock; Decorator: підсвічування недавніх.
    for (const project of exp.projects) {
      const leaf: IBlock = new ProjectBlock(project);
      const block: IBlock = project.isRecent
        ? new HighlightDecorator(leaf)
        : leaf;
      item.appendChild(block.render());
    }

    return item;
  }
}

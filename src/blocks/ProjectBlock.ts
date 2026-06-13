/**
 * Патерн Composite — листовий вузол.
 *
 * ProjectBlock відображає окремий проєкт і не має дочірніх елементів.
 */

import { Project } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class ProjectBlock implements IBlock {
  constructor(private d: Project) {}

  render(): HTMLElement {
    const container = document.createElement("div");
    container.className = "project-item";

    const name = document.createElement("strong");
    name.textContent = this.d.name;

    container.append("• ", name, ` – ${this.d.description}`);
    return container;
  }
}

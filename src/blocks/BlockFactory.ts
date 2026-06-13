/**
 * Патерн Factory Method (Фабричний метод)
 *
 * Клас BlockFactory інкапсулює створення блоків різних типів.
 * Метод createBlock(type, model) повертає інстанс класу-блоку,
 * що реалізує спільний інтерфейс IBlock { render(): HTMLElement }.
 */

import { ResumeModel } from "../models/ResumeModel";
import { HeaderBlock } from "./HeaderBlock";
import { SummaryBlock } from "./SummaryBlock";
import { ExperienceBlock } from "./ExperienceBlock";
import { EducationBlock } from "./EducationBlock";
import { SkillsBlock } from "./SkillsBlock";

/** Спільний інтерфейс усіх блоків резюме. */
export interface IBlock {
  render(): HTMLElement;
}

export type BlockType =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "skills";

export class BlockFactory {
  /**
   * Фабричний метод: створює блок відповідного типу.
   *
   * @param type  Тип блоку для створення
   * @param m     Повна модель резюме
   * @returns     Інстанс IBlock, готовий до рендерингу
   */
  createBlock(type: BlockType, m: ResumeModel): IBlock {
    switch (type) {
      case "header":
        return new HeaderBlock(m.header);
      case "summary":
        return new SummaryBlock(m.summary);
      case "experience":
        return new ExperienceBlock(m.experience);
      case "education":
        return new EducationBlock(m.education);
      case "skills":
        return new SkillsBlock(m.skills);
      default:
        throw new Error(`Unknown block type: ${type}`);
    }
  }
}

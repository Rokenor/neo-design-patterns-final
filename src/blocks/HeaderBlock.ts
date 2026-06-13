/**
 * Блок відображення заголовка резюме: ім'я, посада та контакти.
 */

import { ResumeModel } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class HeaderBlock implements IBlock {
  constructor(private d: ResumeModel["header"]) {}

  render(): HTMLElement {
    const header = document.createElement("header");
    header.className = "section header";

    const { fullName, title, contacts } = this.d;
    const contactLine = [contacts.email, contacts.phone, contacts.location]
      .filter(Boolean)
      .join(" · ");

    const h1 = document.createElement("h1");
    h1.textContent = fullName;

    const titleEl = document.createElement("p");
    titleEl.className = "title";
    titleEl.textContent = title;

    const contactsEl = document.createElement("p");
    contactsEl.className = "contacts";
    contactsEl.textContent = contactLine;

    header.append(h1, titleEl, contactsEl);
    return header;
  }
}

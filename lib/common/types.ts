import {Page} from 'puppeteer';

export type Credential = {
  username: string;
  password: string;
}

export type Scenario = {
  steps: Step[];
}

export type Step = {
  name: string;
  runIf?: (page: Page) => Promise<boolean>;
  instructions: Instruction[];
}

export type Instruction = {
  name: string;
  execute: (page: Page) => Promise<Page | void | null> | Promise<Page> | Promise<void>;
};
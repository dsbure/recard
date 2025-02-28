export interface IFlashcardInteraction {
  multipleChoices?: string[];
  identification?: string;
  matchType?: { [key: string]: string };
  checkboxes?: string[];
  trueFalse?: boolean;

  correct: string | string[];
}

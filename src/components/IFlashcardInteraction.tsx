export interface IFlashcardInteraction {
  multipleChoices?: string[];
  identification?: string;
  checkboxes?: string[];
  trueFalse?: boolean;

  matchTypeSideA?: string[];
  matchTypeSideB?: string[];

  correct: string | string[];
}

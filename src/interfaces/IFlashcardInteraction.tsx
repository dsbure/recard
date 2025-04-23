export interface IFlashcardInteraction {
  multipleChoices?: string[];
  identification?: string;
  checkboxes?: string[];
  trueFalse?: boolean;

  matchTypeSideA?: string[];
  matchTypeSideB?: string[];

  images?: string[];

  correct: string | string[];
  explanation?: string;
}

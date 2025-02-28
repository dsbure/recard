import { IFlashcardInteraction } from "./IFlashcardInteraction";

export interface IFlashcardTopic {
  topicName: string;
  categoryName: string;
  id: number;
  repeatTotal: number;
  flashcards: [
    {
      question: string;
      type: "multipleChoice" | "identification" | "matchType" | "checkboxes" | "trueFalse";
      interaction: IFlashcardInteraction;
    }
  ];
}

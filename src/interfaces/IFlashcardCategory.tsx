import { IFlashcardTopic } from "./IFlashcardTopic";

export interface IFlashcardCategory {
  categoryName: string;
  categoryDesc: string;
  index: number;
  topics: IFlashcardTopic[];

  gemName: string;
  gemIcon: string;
  gemQtr: string;
}

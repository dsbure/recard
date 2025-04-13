import { Ref } from 'react';
import { IFlashcardInteraction } from './IFlashcardInteraction';
import { IFlashcardTopic } from './IFlashcardTopic';


export interface IFInteractionProps {
  flashcard: IFlashcardTopic["flashcards"]["0"];
  handleAnswerClick: Function;
  interaction: IFlashcardInteraction;
  skeleton: boolean;
  ref?: Ref<any>;
}

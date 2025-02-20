import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { StoryFlashcard } from './StoryFlashcard';
import './StorySnake.css';
import { IFlashcardCategory } from './IFlashcardCategory';
import { IFlashcardStorageCategory } from '../services/flashcardStorageService';

export interface IStorySnakeProps {
  category: IFlashcardCategory;
  categoryData: IFlashcardStorageCategory | undefined;
}

export function StorySnake({ category, categoryData }: IStorySnakeProps) {
  let storyFlashcards: any[] = [];
  category.topics.forEach((e, index) => {
    storyFlashcards.push({ offset: (Math.sin(index * 0.5)) * 70, flashcard: e });
  });
  
  return (<IonGrid className="storySnake">
    {storyFlashcards.map((fc, index) => {
      return <IonRow key={index}>
        <IonCol>
          <StoryFlashcard offset={fc.offset} topic={fc.flashcard} locked={(categoryData?.currentId || 0) < index}/>
        </IonCol>
      </IonRow>
    }
    )}
  </IonGrid>);
}

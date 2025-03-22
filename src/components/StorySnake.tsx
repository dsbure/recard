import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { StoryFlashcard } from './StoryFlashcard';
import './StorySnake.css';
import { IFlashcardCategory } from '../interfaces/IFlashcardCategory';
import { IFlashcardStorageCategory } from '../services/FlashcardStorageService';

export interface IStorySnakeProps {
  category: IFlashcardCategory;
  categoryData: IFlashcardStorageCategory | undefined;
}

export function StorySnake({ category, categoryData }: IStorySnakeProps) {
  let storyFlashcards: any[] = [];
  category.topics.forEach((e, index) => {
    storyFlashcards.push({ offset: ((-Math.cos(index * 0.5)) * 40) + 40, flashcard: e });
  });
  
  return (<IonGrid className="storySnake">
    {storyFlashcards.map((fc, index) => {
      return <IonRow key={index}>
        <IonCol>
          <StoryFlashcard offset={fc.offset} topic={fc.flashcard} locked={(categoryData?.currentId || 0) < index} progress={(categoryData?.currentId || 0) == index ? Math.max(((categoryData?.starProgress || 0) / (categoryData?.starTotal || 3)) * 100, 0.001) : 0} newTopic={(categoryData?.currentId || 0) == index}/>
        </IonCol>
      </IonRow>
    }
    )}
  </IonGrid>);
}

import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { StoryFlashcard } from './StoryFlashcard';
import './StorySnake.css';
import { IFlashcardCategory } from './IFlashcardCategory';


export function StorySnake(category: IFlashcardCategory) {
  let storyFlashcards: any[] = [];
  category.topics.forEach((e, index) => {
    storyFlashcards.push({ offset: (Math.sin(index * 0.5)) * 70, flashcard: e });
  });
  
  return (<IonGrid className="storySnake">
    {storyFlashcards.map((fc, index) => {
      return <IonRow key={index}>
        <IonCol>
          <StoryFlashcard offset={fc.offset} topic={fc.flashcard} />
        </IonCol>
      </IonRow>
    }
    )}
  </IonGrid>);
}

import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { StoryFlashcard } from './StoryFlashcard';
import './StorySnake.css';


export function StorySnake() {
  let storyFlashcardNames = Array(25).fill('');
  let storyFlashcards: any[] = [];
  storyFlashcardNames.forEach((e, index) => {
    storyFlashcards.push({ name: e , offset: (Math.sin(index * 0.5)) * 70});
  });

  console.log(storyFlashcards);

  return (<IonGrid className="storySnake">
    {storyFlashcards.map((fc, index) =>
      <IonRow key={index}>
        <IonCol>
          <StoryFlashcard name={fc.name} offset={fc.offset} />
        </IonCol>
      </IonRow>
    )}
  </IonGrid>);
}

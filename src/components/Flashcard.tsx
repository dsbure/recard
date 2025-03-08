import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonLabel, IonSkeletonText } from '@ionic/react';
import { useEffect, useState } from 'react';
import { IFlashcardTopic } from './IFlashcardTopic';
import './Flashcard.css';
import { FMultipleChoice } from './FMultipleChoice';
import { IFlashcardInteraction } from './IFlashcardInteraction';
import { FIdentification } from './FIdentification';
import { FTrueOrFalse } from './FTrueOrFalse';
import { FCheckboxes } from './FCheckboxes';

export interface IFlashcardProps {
  flashcard: IFlashcardTopic["flashcards"]["0"]
  index: number
  handleAnswerClick: Function
  type: "multipleChoice" | "identification" | "matchType" | "checkboxes" | "trueFalse"
  interaction: IFlashcardInteraction
  skeleton: boolean
}

export function Flashcard({ index, flashcard, handleAnswerClick, type, interaction, skeleton }: IFlashcardProps) {
  return (<IonGrid className="flashcard-content">
    <IonRow>
      <IonCol>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>{"Question " + index} </IonCardSubtitle>
            <IonCardTitle>{flashcard.question}</IonCardTitle>
          </IonCardHeader>
        </IonCard>
      </IonCol>
    </IonRow>
    <IonRow className={"choice-container f-" + type}>
      <IonCol className={type === "multipleChoice" || type === "trueFalse" || type === "checkboxes" ? "ion-padding" : ""}>
        {type === "multipleChoice" ?
          <FMultipleChoice flashcard={flashcard} handleAnswerClick={handleAnswerClick} skeleton={skeleton} interaction={interaction}/> : 
        type === "identification" ?
          <FIdentification flashcard={flashcard} handleAnswerClick={handleAnswerClick} skeleton={skeleton} interaction={interaction} /> : 
        type === "trueFalse" ?
          <FTrueOrFalse    flashcard={flashcard} handleAnswerClick={handleAnswerClick} skeleton={skeleton} interaction={interaction}/> : 
        type === "checkboxes" ?
          <FCheckboxes    flashcard={flashcard} handleAnswerClick={handleAnswerClick} skeleton={skeleton} interaction={interaction}/> : null}
      </IonCol>
    </IonRow>
  </IonGrid>);
}

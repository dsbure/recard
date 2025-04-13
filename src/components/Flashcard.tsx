import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonLabel, IonSkeletonText } from '@ionic/react';
import { Ref, useEffect, useState } from 'react';
import { IFlashcardTopic } from '../interfaces/IFlashcardTopic';
import './Flashcard.css';
import { FMultipleChoice } from './FMultipleChoice';
import { IFlashcardInteraction } from '../interfaces/IFlashcardInteraction';
import { FIdentification } from './FIdentification';
import { FTrueOrFalse } from './FTrueOrFalse';
import { FCheckboxes } from './FCheckboxes';
import { FMatchingType } from './FMatchingType';
import React from 'react';

const humanReadableNames = {
  "multipleChoice": "MULTIPLE CHOICE",
  "identification": "IDENTIFICATION",
  "matchType": "MATCHING TYPE",
  "checkboxes": "CHECKBOXES",
  "trueFalse": "TRUE OR FALSE"
};

export interface IFlashcardProps {
  flashcard: IFlashcardTopic["flashcards"]["0"]
  index: number
  handleAnswerClick: Function
  type: "multipleChoice" | "identification" | "matchType" | "checkboxes" | "trueFalse"
  interaction: IFlashcardInteraction
  skeleton: boolean
  ref?: Ref<any>
}

export const Flashcard = React.forwardRef<any, IFlashcardProps>(({ index, flashcard, handleAnswerClick, type, interaction, skeleton }, ref) => {
  return (<IonGrid className="flashcard-content">
    <IonRow>
      <IonCol>
        <IonCard className="question">
          <IonCardHeader>
            <IonCardSubtitle className="question-header">
              <span>
                {"Question " + index}
              </span>
              <span className="type">
                {humanReadableNames[type]}
              </span>
            </IonCardSubtitle>
            <IonCardTitle>{flashcard.question}</IonCardTitle>
          </IonCardHeader>
        </IonCard>
      </IonCol>
    </IonRow>
    <IonRow className={("choice-container f-" + type) + (skeleton ? "" : " animate__animated animate__fadeIn")}>
      <IonCol className={type === "multipleChoice" || type === "trueFalse" || type === "checkboxes" || type === "matchType" ? "ion-padding" : ""}>
        {type === "multipleChoice" ?
          <FMultipleChoice flashcard={flashcard} handleAnswerClick={handleAnswerClick} skeleton={skeleton} interaction={interaction} ref={ref}/> : 
        type === "identification" ?
          <FIdentification flashcard={flashcard} handleAnswerClick={handleAnswerClick} skeleton={skeleton} interaction={interaction}/> : 
        type === "trueFalse" ?
          <FTrueOrFalse    flashcard={flashcard} handleAnswerClick={handleAnswerClick} skeleton={skeleton} interaction={interaction}/> : 
        type === "checkboxes" ?
          <FCheckboxes     flashcard={flashcard} handleAnswerClick={handleAnswerClick} skeleton={skeleton} interaction={interaction}/> : 
        type === "matchType" ?
          <FMatchingType   flashcard={flashcard} handleAnswerClick={handleAnswerClick} skeleton={skeleton} interaction={interaction}/> : null}
      </IonCol>
    </IonRow>
  </IonGrid>);
});

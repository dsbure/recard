import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonLabel, IonSkeletonText, IonInput, IonCardContent, useIonViewWillEnter } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import './FIdentification.css';
import { IFInteractionProps } from '../interfaces/IFInteractionProps';

export function FIdentification({ handleAnswerClick, interaction, skeleton }: IFInteractionProps) {
  const input = useRef<HTMLIonInputElement>(null);
  useEffect(() => {
    const submitEvent = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleAnswer(input.current?.value?.toString().toLowerCase().trim() || "");
      }
    };
    if (!skeleton) {
      setTimeout(() => {
        input.current?.setFocus();
      }, 100);
      addEventListener("keydown", submitEvent);
    }
    return () => {
      removeEventListener("keydown", submitEvent);
    };
  }, [skeleton]);

  const handleAnswer = (q: string) => {
    if (q === "") return;
    if (Array.isArray(interaction.correct)) {
      handleAnswerClick(interaction.correct.map(e => e.toLowerCase()).includes(q.toLowerCase()), q);
    } else {
      handleAnswerClick(interaction.correct.toLowerCase() === q, q, "identification");
    }
  }
  return (<IonCard>
    <IonCardContent className="identification-content">
      <IonInput label="Answer" labelPlacement="floating" fill="outline" placeholder="Enter your answer" ref={input} clearInput={true}></IonInput>
      <IonButton expand="block" onClick={() => handleAnswer(input.current?.value?.toString().toLowerCase().trim() || "")}>Submit</IonButton>
    </IonCardContent>
  </IonCard>);
}

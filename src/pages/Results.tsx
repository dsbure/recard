import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import './Results.css';
import { useParams } from 'react-router';
import { checkmarkCircle, flag, pin, star, timer, warning } from 'ionicons/icons';
import { useState } from 'react';
import EXPStorageService from '../services/EXPStorageService';


const Results: React.FC = () => {
  const [score, setScore] = useState(0);
  const [exp, setExp] = useState(0);
  const [total, setTotal] = useState(1);
  const [formattedTime, setFormattedTime] = useState("");
  const [topicName, setTopicName] = useState("Topic");

  useIonViewWillEnter(() => {
    const data = JSON.parse(localStorage.getItem("currentFlashcard")!);

    setTotal(parseInt(data.flashcards.length));
    setTopicName(data.topicName);
    setScore(parseInt(localStorage.getItem("flashcardScore")!));

    setFormattedTime(localStorage.getItem("formattedTime")!);

    const accuracy = parseInt(localStorage.getItem("flashcardScore")!) / parseInt(data.flashcards.length);

    const experience = Math.round((1800000) * (accuracy) / parseInt(localStorage.getItem("rawTime")!));
    setExp(experience);
    EXPStorageService.addEXP(experience);
  });
  return (
    <IonPage>
      <IonHeader id="results-header">
        <IonToolbar>
          <IonTitle>Results</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="results-container">
          <IonCard className="results-card">
            <IonCardContent className="results-icon">
              <IonIcon icon={flag} size="large"/>
            </IonCardContent>
            <IonCardContent className="summary">
              <IonChip className="timer" outline={true}>
                <IonIcon icon={timer} />
                <IonLabel>
                  {formattedTime}
                </IonLabel>
              </IonChip>
              <IonChip outline={true}>
                <IonIcon icon={checkmarkCircle} />
                <IonLabel>
                  {Math.round((score / total) * 100)}% ({score + "/" + total})
                </IonLabel>
              </IonChip>
              <IonChip className="score" color="warning">
                <IonIcon icon={star} />
                <IonLabel>
                  {exp}XP
                </IonLabel>
              </IonChip>
            </IonCardContent>
            <IonCardHeader className="results-header">
              <IonCardTitle>
                Level Finished!
              </IonCardTitle>
              <IonCardSubtitle>{topicName}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonButton expand="block" routerLink="/mainTab" routerDirection="back">Return to Home</IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Results;

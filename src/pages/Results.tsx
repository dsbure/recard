import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import './Results.css';
import { useParams } from 'react-router';
import { checkmarkCircle, flag, pin, star, timer } from 'ionicons/icons';
import { useState } from 'react';
import EXPStorageService from '../services/EXPStorageService';
import FlashcardStorageService, { IFlashcardStorageCategory } from '../services/FlashcardStorageService';
import { IFlashcardTopic } from '../interfaces/IFlashcardTopic';
import FetchFlashcardData from '../services/FetchFlashcardData';


const Results: React.FC = () => {
  const [score, setScore] = useState(0);
  const [exp, setExp] = useState(0);
  const [total, setTotal] = useState(1);
  const [formattedTime, setFormattedTime] = useState("");
  const [topicName, setTopicName] = useState("Topic");
  
  const [flashcardData, setFlashcardData] = useState<IFlashcardTopic>(JSON.parse(localStorage.getItem("currentFlashcard")!));

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
    setFlashcardData(JSON.parse(localStorage.getItem("currentFlashcard")!));
  });

  const debug_unlockAll = async () => {
    const currentCategoryData: IFlashcardStorageCategory = await FlashcardStorageService.getCategoryData(flashcardData.categoryName);
    await FlashcardStorageService.setCategoryData({
      category: flashcardData.categoryName,
      currentId: await FetchFlashcardData.getCategoryTotal(currentCategoryData.category) - 1,
      starProgress: 3,
      starTotal: flashcardData.id === currentCategoryData?.currentId || 0 ? flashcardData.repeatTotal : currentCategoryData?.starTotal || flashcardData.repeatTotal,
      isComplete: true,
    });
  }
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
              <IonButton expand="block" routerLink="/mainTab" routerDirection="back" onClick={debug_unlockAll} color="warning">[DEBUG] Unlock All in this Category</IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Results;

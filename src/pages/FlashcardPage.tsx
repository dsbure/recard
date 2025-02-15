import { IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonProgressBar, IonTitle, IonToast, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import './FlashcardPage.css';
import { useEffect, useState } from 'react';
import { Flashcard } from '../components/Flashcard';
import { useHistory } from 'react-router';
import { arrowBack } from 'ionicons/icons';
import { IFlashcardTopic } from '../components/IFlashcardTopic';


const FlashcardPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [correctAnswers, setCA] = useState(0);
  const [currentQuestionIndex, setCQI] = useState(0);
  const [correctedAnswer, setCorrectedAnswer] = useState("");

  const [toastOpen, setToastOpen] = useState(false);

  const router = useIonRouter();

  const [flashcardData, setFlashcardData] = useState<IFlashcardTopic>(JSON.parse(localStorage.getItem("currentFlashcard")!));

  useIonViewWillEnter(() => {
    setCA(0);
    setCQI(0);
    const data = JSON.parse(localStorage.getItem("currentFlashcard")!);
    setFlashcardData(data);
    setProgress((currentQuestionIndex + 1) / (data.flashcards.length + 1));
  });

  useEffect(() => {
    setProgress((currentQuestionIndex + 1) / (flashcardData.flashcards.length + 1));
  }, [currentQuestionIndex]);

  const handleAnswerClick = (choice: string) => {
    const newScore = correctAnswers + (choice === flashcardData.flashcards[currentQuestionIndex].correct ? 1 : 0);

    if (choice !== flashcardData.flashcards[currentQuestionIndex].correct) {
      setCorrectedAnswer(flashcardData.flashcards[currentQuestionIndex].correct);
      setToastOpen(true);
    }
    if (currentQuestionIndex + 1 < flashcardData.flashcards.length) {
      setCQI(currentQuestionIndex + 1);
      setCA(newScore);
    } else {
      setCA(newScore);
      const resultsURL = `/results/${newScore}/${flashcardData.flashcards.length}/${flashcardData.topicName}`;
      router.push(resultsURL);
    }
  };
  return (
    <IonPage>
      <IonHeader id="header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/mainTab" routerDirection="back" shape="round">
              <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Flashcard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton routerLink="/mainTab" shape="round" routerDirection="back">
                <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle size="large">Flashcard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <IonProgressBar value={progress} />
        </IonCard>
        <IonLabel className="ion-padding">
          {currentQuestionIndex + 1 + "/" + flashcardData.flashcards.length}
        </IonLabel>
        <IonLabel className="ion-padding">
          {flashcardData.topicName}
        </IonLabel>
        <Flashcard text={flashcardData.flashcards[currentQuestionIndex].question} index={currentQuestionIndex + 1} choices={flashcardData.flashcards[currentQuestionIndex].multipleChoices} handleAnswerClick={handleAnswerClick} />
        <IonToast
          isOpen={toastOpen}
          message={"Wrong! Answer is " + correctedAnswer}
          onDidDismiss={() => setToastOpen(false)}
          duration={2000}
          position="top"
          positionAnchor="header"
        ></IonToast>
      </IonContent>
    </IonPage >
  );
};

export default FlashcardPage;

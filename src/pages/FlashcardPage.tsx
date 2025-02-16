import { createAnimation, Animation, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonModal, IonPage, IonProgressBar, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonTitle, IonToast, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import './FlashcardPage.css';
import { useEffect, useRef, useState } from 'react';
import { Flashcard } from '../components/Flashcard';
import { useHistory } from 'react-router';
import { arrowBack, checkmark, checkmarkCircle, close, closeCircle } from 'ionicons/icons';
import { IFlashcardTopic } from '../components/IFlashcardTopic';


const FlashcardPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [correctAnswers, setCA] = useState(0);
  const [currentQuestionIndex, setCQI] = useState(0);
  const [correctedAnswer, setCorrectedAnswer] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");

  const [toastOpen, setToastOpen] = useState(false);
  const [modal, setModal] = useState<HTMLIonModalElement | null>(null);

  const card = useRef<HTMLDivElement | null>(null);
  const cardAnim = useRef<Animation | null>(null);

  const router = useIonRouter();

  const [flashcardData, setFlashcardData] = useState<IFlashcardTopic>(JSON.parse(localStorage.getItem("currentFlashcard")!));

  useIonViewWillEnter(() => {
    setCA(0);
    setCQI(0);
    const data = JSON.parse(localStorage.getItem("currentFlashcard")!);
    setFlashcardData(data);
    setTimeout(() => setProgress((currentQuestionIndex + 1) / (data.flashcards.length + 1)), 0);
  });

  useEffect(() => {
    if (!cardAnim.current) {
      cardAnim.current = createAnimation()
        .addElement(card.current!)
        .duration(500)
        .easing("cubic-bezier(0.05, 0.7, 0.1, 1.0)")
        .fromTo('transform', 'translateX(0%)', 'translateX(-50%)');
    }
  }, [card]);

  const handleNextFlashcard = (newScore: number) => {
    if (currentQuestionIndex + 1 < flashcardData.flashcards.length) {
      setProgress((currentQuestionIndex + 2) / (flashcardData.flashcards.length + 1));
      cardAnim.current?.play();
      cardAnim.current?.onFinish(() => {
        setTimeout(() => {
          cardAnim.current?.stop();
          setCQI(currentQuestionIndex + 1);
        }, 0);
      });
    } else {
      const resultsURL = `/results/${newScore}/${flashcardData.flashcards.length}/${flashcardData.topicName}`;
      router.push(resultsURL);
    }
  }
  const handleAnswerClick = (choice: string) => {
    setCurrentAnswer(choice);
    const newScore = correctAnswers + (choice === flashcardData.flashcards[currentQuestionIndex].correct ? 1 : 0);
    setCA(newScore);
    if (choice !== flashcardData.flashcards[currentQuestionIndex].correct) {
      setCorrectedAnswer(flashcardData.flashcards[currentQuestionIndex].correct);
      setToastOpen(true);
      return;
    }
    handleNextFlashcard(newScore);
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
        <div ref={card} id="flashcards" className={"non-scroll" + (currentQuestionIndex + 1 < flashcardData.flashcards.length ? "" : " lonely")}>
          <div id="curr">
            <Flashcard key={currentQuestionIndex} text={flashcardData.flashcards[currentQuestionIndex].question} index={currentQuestionIndex + 1} choices={flashcardData.flashcards[currentQuestionIndex].multipleChoices} handleAnswerClick={handleAnswerClick} />
          </div>
          {(currentQuestionIndex + 1 < flashcardData.flashcards.length ?
            <div id="next">
              <Flashcard key={currentQuestionIndex + 1} text={flashcardData.flashcards[currentQuestionIndex + 1].question} index={currentQuestionIndex + 2} choices={flashcardData.flashcards[currentQuestionIndex + 1].multipleChoices} handleAnswerClick={handleAnswerClick} />
            </div>
            : <></>)}
        </div>


        <IonModal id="question-modal" ref={(e) => setModal(e)} isOpen={toastOpen} canDismiss={!toastOpen} handle={false} initialBreakpoint={1} breakpoints={[0, 1]}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Incorrect!</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonChip color="danger">
                <IonIcon icon={closeCircle} />
                <IonLabel>Your answer:</IonLabel>
              </IonChip> {currentAnswer}
              <br />
              <IonChip color="success">
                <IonIcon icon={checkmarkCircle} />
                <IonLabel>Correct answer:</IonLabel>
              </IonChip> {correctedAnswer}
              <IonButton expand="block" onClick={() => {
                modal?.dismiss();
                setToastOpen(false);
                handleNextFlashcard(correctAnswers);
              }}>
                Next
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonModal>
      </IonContent>
    </IonPage >
  );
};

export default FlashcardPage;

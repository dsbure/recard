import { createAnimation, Animation, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonModal, IonPage, IonProgressBar, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonTitle, IonToast, IonToolbar, useIonRouter, useIonViewWillEnter, IonAlert, useIonAlert } from '@ionic/react';
import './FlashcardPage.css';
import { useEffect, useRef, useState } from 'react';
import { Flashcard } from '../components/Flashcard';
import { useHistory } from 'react-router';
import { arrowBack, checkmark, checkmarkCircle, close, closeCircle, heart } from 'ionicons/icons';
import { IFlashcardTopic } from '../components/IFlashcardTopic';
import StorageService from '../services/StorageService';
import flashcardStorageService, { IFlashcardStorageCategory } from '../services/flashcardStorageService';


const FlashcardPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [correctAnswers, setCA] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [totalLives, setTotalLives] = useState(3);
  const [currentQuestionIndex, setCQI] = useState(0);
  const [correctedAnswer, setCorrectedAnswer] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");

  const [presentAlert] = useIonAlert();

  const [toastOpen, setToastOpen] = useState(false);
  const [modal, setModal] = useState<HTMLIonModalElement | null>(null);

  const card = useRef<HTMLDivElement | null>(null);
  const cardAnim = useRef<Animation | null>(null);

  const router = useIonRouter();

  const [flashcardData, setFlashcardData] = useState<IFlashcardTopic>(JSON.parse(localStorage.getItem("currentFlashcard")!));

  useIonViewWillEnter(() => {
    setMistakes(0);
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

  const handleNextFlashcard = async (newScore: number) => {
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
      const currentCategoryData: IFlashcardStorageCategory = await flashcardStorageService.getCategoryData(flashcardData.categoryName);
      await flashcardStorageService.setCategoryData({
        category: flashcardData.categoryName,
        currentId: Math.max(flashcardData.id + 1, currentCategoryData?.currentId || 0),
        starProgress: 0,
        starTotal: 0,
      });
      setMistakes(0);
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
      setMistakes((prevMistakes) => prevMistakes + 1);
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
        <IonCard>
          <IonProgressBar value={progress} />
        </IonCard>
        <span style={{ display: 'flex', paddingBlock: '0' }} className="ion-padding">
          <IonLabel className="ion-padding">
            {currentQuestionIndex + 1 + "/" + flashcardData.flashcards.length}
          </IonLabel>
          <IonLabel className="ion-padding">
            {flashcardData.topicName}
          </IonLabel>
          <span style={{ flex: '1' }}></span>
          <IonChip color={totalLives - mistakes <= 0 ? "dark" : "danger"}>
            <IonLabel>{totalLives - mistakes}</IonLabel>
            <IonIcon icon={heart} />
          </IonChip>
        </span>
        <div ref={card} id="flashcards" className={"non-scroll" + (currentQuestionIndex + 1 < flashcardData.flashcards.length ? "" : " lonely")}>
          <div id="curr">
            <Flashcard key={currentQuestionIndex} text={flashcardData.flashcards[currentQuestionIndex].question} index={currentQuestionIndex + 1} choices={flashcardData.flashcards[currentQuestionIndex].multipleChoices} handleAnswerClick={handleAnswerClick} skeletonChoices={false} />
          </div>
          {(currentQuestionIndex + 1 < flashcardData.flashcards.length ?
            <div id="next">
              <Flashcard key={currentQuestionIndex + 1} text={flashcardData.flashcards[currentQuestionIndex + 1].question} index={currentQuestionIndex + 2} choices={flashcardData.flashcards[currentQuestionIndex + 1].multipleChoices} handleAnswerClick={() => { }} skeletonChoices={true} />
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
                if (totalLives - mistakes > 0) {
                  handleNextFlashcard(correctAnswers);
                } else {
                  presentAlert({
                    header: 'Better luck next time!',
                    message: 'You ran out of lives. ',
                    backdropDismiss: false,
                    buttons: [{
                      text: 'OK',
                      role: 'close',
                      handler: () => {
                        setMistakes(0);
                        router.push('/mainTab');
                      },
                    }],
                  });
                }
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

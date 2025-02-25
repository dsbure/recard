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
  const [totalLives, setTotalLives] = useState(5);
  const [currentQuestionIndex, setCQI] = useState(0);
  const [currentQuestionOrder, setCQO] = useState<number[]>([0, 0]);
  const [correctedAnswer, setCorrectedAnswer] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");

  const [presentAlert] = useIonAlert();

  const [toastOpen, setToastOpen] = useState(false);
  const [modal, setModal] = useState<HTMLIonModalElement | null>(null);

  const card = useRef<HTMLDivElement | null>(null);
  const cardAnim = useRef<Animation | null>(null);

  const router = useIonRouter();

  const [flashcardData, setFlashcardData] = useState<IFlashcardTopic>(JSON.parse(localStorage.getItem("currentFlashcard")!));

  const shuffleOrder = (items: number) => {
    const order = [];
    for (let i = 0; i < items; i++) {
      order.push(i);
    }
    const shuffledOrder = order.map(e => ({ e, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ e }) => e);
    return shuffledOrder;
  };

  useIonViewWillEnter(() => {
    setMistakes(0);
    setCA(0);
    setCQI(0);
    setCorrectedAnswer("");
    const data = JSON.parse(localStorage.getItem("currentFlashcard")!);
    setCQO(shuffleOrder(data.flashcards.length));
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
      setCorrectedAnswer("");
      cardAnim.current?.play();
      cardAnim.current?.onFinish(() => {
        setTimeout(() => {
          cardAnim.current?.stop();
          setCQI(currentQuestionIndex + 1);
        }, 0);
      });
    } else {
      const currentCategoryData: IFlashcardStorageCategory = await flashcardStorageService.getCategoryData(flashcardData.categoryName);
      let starProgress = flashcardData.id === currentCategoryData?.currentId || 0 ?
        (currentCategoryData?.starProgress || 0) + 1 === flashcardData.repeatTotal ? 0 :
          (currentCategoryData?.starProgress || 0) + 1 :
        currentCategoryData?.starProgress || 1;
      console.log(starProgress);

      await flashcardStorageService.setCategoryData({
        category: flashcardData.categoryName,
        currentId: (currentCategoryData?.starProgress || 0) + 1 === flashcardData.repeatTotal ? Math.max(flashcardData.id + 1, currentCategoryData?.currentId || 0) : currentCategoryData?.currentId || 0,
        starProgress: starProgress,
        starTotal: flashcardData.id === currentCategoryData?.currentId || 0 ? flashcardData.repeatTotal : currentCategoryData?.starTotal || flashcardData.repeatTotal,
      });
      setMistakes(0);
      const resultsURL = `/results/${newScore}/${flashcardData.flashcards.length}/${flashcardData.topicName}`;
      router.push(resultsURL);
    }
  }
  const handleAnswerClick = (choice: string) => {
    setCurrentAnswer(choice);
    const newScore = correctAnswers + (choice === flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]].correct ? 1 : 0);
    setCA(newScore);
    setCorrectedAnswer(flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]].correct);
    if (choice !== flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]].correct) {
      setToastOpen(true);
      setMistakes((prevMistakes) => prevMistakes + 1);
      return;
    }
    setTimeout(() => handleNextFlashcard(newScore), 2000);
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
      <IonContent fullscreen className="flashcard-page">
        <div className="container">
          <div>
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
          </div>
          <div ref={card} id="flashcards" className={"non-scroll" + (currentQuestionOrder[currentQuestionIndex + 1] < flashcardData.flashcards.length ? "" : " lonely")}>
            <div id="curr">
              <Flashcard key={currentQuestionIndex} flashcard={flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]]} index={currentQuestionIndex + 1} handleAnswerClick={handleAnswerClick} skeletonChoices={false} correctChoice={correctedAnswer}/>
            </div>
            {(currentQuestionOrder[currentQuestionIndex + 1] < flashcardData.flashcards.length ?
              <div id="next">
                <Flashcard key={currentQuestionIndex + 1} flashcard={flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex + 1]]} index={currentQuestionIndex + 2} handleAnswerClick={() => { }} skeletonChoices={true} />
              </div>
              : <></>)}
          </div>
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

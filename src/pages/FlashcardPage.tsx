import { createAnimation, Animation, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonModal, IonPage, IonProgressBar, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonTitle, IonToast, IonToolbar, useIonRouter, useIonViewWillEnter, IonAlert, useIonAlert } from '@ionic/react';
import './FlashcardPage.css';
import { useEffect, useRef, useState } from 'react';
import { Flashcard } from '../components/Flashcard';
import { useHistory } from 'react-router';
import { arrowBack, checkmark, checkmarkCircle, close, closeCircle, heart, timer } from 'ionicons/icons';
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
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState("00:00");

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
    setStartTime(Date.now());
    setCurrentTime(Date.now());
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

  useEffect(() => {
    // https://stackoverflow.com/a/59861536
    const interval = setInterval(() => setCurrentTime(Date.now()), 500);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setFormattedTime(formatTime(currentTime - startTime));
  }, [currentTime]);

  const formatTime = (time: number) => {
    // w3schools
    const days = Math.floor(time / (1000 * 60 * 60 * 24)); // grabe naman guys
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return (days != 0 ? days + ":" : "") + (hours != 0 ? String(hours).padStart(2, '0') + ":" : "") + String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
  };
  
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
        (currentCategoryData?.starProgress || 0) + 1 >= flashcardData.repeatTotal ?
          0 : (currentCategoryData?.starProgress || 0) + 1 :
        currentCategoryData?.starProgress || 1;

      await flashcardStorageService.setCategoryData({
        category: flashcardData.categoryName,
        currentId: (currentCategoryData?.starProgress || 0) + 1 === flashcardData.repeatTotal ? Math.max(flashcardData.id + 1, currentCategoryData?.currentId || 0) : currentCategoryData?.currentId || 0,
        starProgress: starProgress,
        starTotal: flashcardData.id === currentCategoryData?.currentId || 0 ? flashcardData.repeatTotal : currentCategoryData?.starTotal || flashcardData.repeatTotal,
      });
      setMistakes(0);
      const deltaTime = currentTime - startTime;
      localStorage.setItem("flashcardScore", newScore.toString());
      localStorage.setItem("rawTime", deltaTime.toString());
      localStorage.setItem("formattedTime", formattedTime);
      router.push("/results");
    }
  }
  const handleAnswerClick = (correct: boolean, userAnswer: string | string[], type: "multipleChoice" | "identification" | "matchType" | "checkboxes" | "trueFalse") => {
    setCurrentAnswer(Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer);
    const newScore = correctAnswers + (correct ? 1 : 0);
    setCA(newScore);
    const correctAnswer = flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]].interaction.correct;
    setCorrectedAnswer(Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer);
    setIsCorrect(correct);
    if (!correct) {
      setToastOpen(true);
      setMistakes((prevMistakes) => prevMistakes + 1);
      return;
    }
    if (type === "multipleChoice" || type === "trueFalse") {
      setTimeout(() => handleNextFlashcard(newScore), 2000);
    } else {
      setToastOpen(true);
    }
  };
  return (
    <IonPage>
      <IonHeader id="flashcard-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/mainTab" routerDirection="back" shape="round">
              <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Flashcard</IonTitle>
          <IonButtons slot="end">
            <IonChip className="timer" outline={true}>
              <IonIcon icon={timer}/>
              <IonLabel>
                {formattedTime}
              </IonLabel>
            </IonChip>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="flashcard-page">
        <div className="container">
          <div className="flashcard-header ion-padding">
            <IonCard>
              <IonProgressBar value={progress} />
            </IonCard>
            <span className="additional-info">
              <IonChip>
                {currentQuestionIndex + 1 + " / " + flashcardData.flashcards.length}
              </IonChip>
              <IonLabel>
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
              <Flashcard
                key={currentQuestionIndex + "" + startTime}
                flashcard={flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]]}
                index={currentQuestionIndex + 1}
                handleAnswerClick={handleAnswerClick}
                skeleton={false}
                type={flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]].type}
                interaction={flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]].interaction}
              />
            </div>
            {(currentQuestionOrder[currentQuestionIndex + 1] < flashcardData.flashcards.length ?
              <div id="next">
                <Flashcard
                  key={(currentQuestionIndex + 1) + "" + startTime}
                  flashcard={flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex + 1]]}
                  index={currentQuestionIndex + 2}
                  handleAnswerClick={() => { }}
                  skeleton={true}
                  type={flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex + 1]].type}
                  interaction={flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex + 1]].interaction}
                />
              </div>
              : <></>)}
          </div>
        </div>

        <IonModal id="question-modal" ref={(e) => setModal(e)} isOpen={toastOpen} canDismiss={!toastOpen} handle={false} initialBreakpoint={1} breakpoints={[0, 1]}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{(!isCorrect ? "Inc" : "C") + "orrect!"}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {!isCorrect ? <>
                <IonChip color="danger">
                  <IonIcon icon={closeCircle} />
                  <IonLabel>Your answer:</IonLabel>
                </IonChip> {currentAnswer}
                <br />
              </> : null}
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

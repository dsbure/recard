import { createAnimation, Animation, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonModal, IonPage, IonProgressBar, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonTitle, IonToast, IonToolbar, useIonRouter, useIonViewWillEnter, IonAlert, useIonAlert, useIonModal } from '@ionic/react';
import './FlashcardPage.css';
import { useEffect, useRef, useState } from 'react';
import { Flashcard } from '../components/Flashcard';
import { useHistory } from 'react-router';
import { arrowBack, arrowForward, book, checkmark, checkmarkCircle, close, closeCircle, flame, heart, heartDislike, iceCream, snow, timer } from 'ionicons/icons';
import { IFlashcardTopic } from '../interfaces/IFlashcardTopic';
import StorageService from '../services/StorageService';
import FlashcardStorageService, { IFlashcardStorageCategory } from '../services/FlashcardStorageService';
import FetchFlashcardData from '../services/FetchFlashcardData';
import SigmaModes from '../components/SigmaModes';
import ISigmaModes from '../interfaces/ISigmaModes';
import { SigmaModePopup } from '../components/SigmaModePopup';
import { IFlashcardCategory } from '../interfaces/IFlashcardCategory';
import { Howl } from "howler";

// eheh
function easeIn01(x: number): number {
  return Math.pow(Math.max(x, 0), 2);
}

const FlashcardPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [correctAnswers, setCA] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [totalLives, setTotalLives] = useState(3);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [nextUnlockStreak, setNextUnlockStreak] = useState(0);
  const [currentQuestionIndex, setCQI] = useState(0);
  const [currentQuestionOrder, setCQO] = useState<number[]>([0, 0]);
  const [correctedAnswer, setCorrectedAnswer] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const startTimeRef = useRef(questionStartTime);
  const [timeTillDeath, setTimeTillDeath] = useState(0);
  const [timeOut, setTimeOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState("00:00");

  const [hasImmunity, setHasImmunity] = useState(false);
  const [timeFreeze, setTimeFreeze] = useState(false);
  const tfRef = useRef(timeFreeze);
  const [timeFreezeTimeStart, setTFTS] = useState(0);

  const [presentAlert] = useIonAlert();
  const [presentModal, dismissModal] = useIonModal(SigmaModePopup, {
    dismiss: (data: string) => dismissModal(data),
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [modal, setModal] = useState<HTMLIonModalElement | null>(null);

  const card = useRef<HTMLDivElement | null>(null);
  const cardAnim = useRef<Animation | null>(null);
  const currentFlashcard = useRef<any>(null);
  const [availableSigmaModes, setAvailableSigmaModes] = useState<ISigmaModes>({
    skip: 0,
    immunity: 0,
    fiftyFifty: 0,
    timeFreeze: 0,
  });

  const router = useIonRouter();

  const [flashcardData, setFlashcardData] = useState<IFlashcardTopic>(JSON.parse(localStorage.getItem("currentFlashcard")!));

  const [audio, setAudio] = useState<Howl | undefined>();

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
  useEffect(() => {
    startTimeRef.current = questionStartTime;
  }, [questionStartTime]);
  useEffect(() => {
    tfRef.current = timeFreeze;
  }, [timeFreeze]);

  useIonViewWillEnter(() => {
    setStartTime(Date.now());
    setCurrentTime(Date.now());
    setQuestionStartTime(Date.now());
    setTimeTillDeath(1);
    setTimeOut(false);
    setMistakes(0);
    setCA(0);
    setCQI(0);
    setCurrentStreak(0);
    setCorrectedAnswer("");
    setNextUnlockStreak(0);
    setAvailableSigmaModes({
      skip: 0,
      immunity: 0,
      fiftyFifty: 0,
      timeFreeze: 0,
    });
    const data = JSON.parse(localStorage.getItem("currentFlashcard")!);
    setCQO(shuffleOrder(data.flashcards.length));
    setFlashcardData(data);
    setHasImmunity(false);
    setTimeFreeze(false);
    setTimeout(() => setProgress((currentQuestionIndex + 1) / (data.flashcards.length + 1)), 0);

    StorageService.getItem("muted").then((muted) => {
      if (muted === undefined) StorageService.setItem("muted", false);

      const audio = new Howl({
        src: [`/audio/${data.categoryName}.mp3`],
        volume: (muted ?? false) ? 0 : 0.5,
        loop: true,
      });
      audio.play();
      setAudio(audio);
    })
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
    // https://stackoverflow.com/a/59861536
    const interval = setInterval(() => {
      const timeDeath = 1 - (((Date.now() - startTimeRef.current) * 0.000075) - 0.12);
      if (!tfRef.current) setTimeTillDeath(timeDeath);

      if (!tfRef.current) setTimeOut(timeDeath < 0);
    }, 33);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (!timeOut) return;
    if (timeFreeze) return;
    handleAnswerClick(false, "", flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]].type, "");
  }, [timeOut]);

  useEffect(() => {
    if (timeFreeze) return;
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
    setQuestionStartTime(Date.now());
    setTimeOut(false);
    if (!isCorrect && hasImmunity) {
      setHasImmunity(false);
    }
    if (currentQuestionIndex + 1 < flashcardData.flashcards.length) {
      setProgress((currentQuestionIndex + 2) / (flashcardData.flashcards.length + 1));
      setCorrectedAnswer("");
      if (timeFreeze) {
        setTimeFreeze(false);
        setStartTime((prev) =>
          prev + (Date.now() - timeFreezeTimeStart)
        );
      }
      cardAnim.current?.play();
      cardAnim.current?.onFinish(() => {
        setQuestionStartTime(Date.now());
        setTimeout(() => {
          cardAnim.current?.stop();
          setCQI(currentQuestionIndex + 1);
        }, 0);
      });
    } else {
      const currentCategoryData: IFlashcardStorageCategory = await FlashcardStorageService.getCategoryData(flashcardData.categoryName);
      const isLatestFlashcard = flashcardData.id === (currentCategoryData?.currentId ?? 0);
      const incrementedStarProgress = (currentCategoryData?.starProgress ?? 0) + 1;
      const incrementedId = Math.max(flashcardData.id + 1, currentCategoryData?.currentId ?? 0);
      const isEqualOrGreaterThanTotal = (currentCategoryData?.currentId ?? 0) >= (await FetchFlashcardData.getCategoryTotal(currentCategoryData.category)) - 1;

      const starProgress = isLatestFlashcard ?
        incrementedStarProgress >= flashcardData.repeatTotal ?
          0 : incrementedStarProgress :
        currentCategoryData?.starProgress ?? 1;

      const starTotal = isLatestFlashcard ? flashcardData.repeatTotal : currentCategoryData?.starTotal ?? flashcardData.repeatTotal;

      const catIndex = (await StorageService.getItem("cachedCategoryData") as IFlashcardCategory[]).find(e => e.categoryName == flashcardData.categoryName)?.index ?? 1;

      await FlashcardStorageService.setCategoryData({
        category: flashcardData.categoryName,
        catIndex: catIndex,
        currentId: incrementedStarProgress >= flashcardData.repeatTotal ? incrementedId : currentCategoryData?.currentId ?? 0,
        starProgress: starProgress,
        starTotal: starTotal,
        isComplete: (isLatestFlashcard && isEqualOrGreaterThanTotal && incrementedStarProgress >= starTotal) || currentCategoryData?.isComplete,
      });
      setMistakes(0);
      const deltaTime = currentTime - startTime;
      localStorage.setItem("flashcardScore", newScore.toString());
      localStorage.setItem("rawTime", deltaTime.toString());
      localStorage.setItem("formattedTime", formattedTime);
      if (audio !== undefined) audio.stop();
      router.push("/results");
    }
  };

  const handleAnswerClick = (correct: boolean, userAnswer: string | string[], type: "multipleChoice" | "identification" | "matchType" | "checkboxes" | "trueFalse" | "skipped", correctedInContext?: string) => {
    const answerCorrect = hasImmunity || correct;
    setCurrentAnswer(Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer);
    const newScore = correctAnswers + (answerCorrect ? 1 : 0);
    const newStreak = answerCorrect ? currentStreak + 1 : 0;
    const newUnlockStreak = answerCorrect ? nextUnlockStreak + 1 : 0;

    setCA(newScore);
    setCurrentStreak(newStreak);
    setNextUnlockStreak(newUnlockStreak);

    const correctAnswer = flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]].interaction.correct;
    setShowAnswer(type !== "matchType" && type !== "trueFalse");
    const formattedCorrectAnswer = Array.isArray(correctAnswer)
      ? correctAnswer.join(', ')
      : correctAnswer;

    const skippedSuffix = type === "skipped" ? " (skipped)" : "";

    setCorrectedAnswer(correctedInContext || (formattedCorrectAnswer + skippedSuffix));

    setIsCorrect(correct);
    setTFTS(Date.now());
    setTimeFreeze(true);

    if (!answerCorrect) {
      setToastOpen(true);
      setMistakes((prevMistakes) => prevMistakes + 1);
      return;
    }
    if (newUnlockStreak >= 4) {
      setNextUnlockStreak(0);
      presentModal({
        id: "alert-sigma-modes",
        backdropDismiss: false,
        onWillDismiss: (value) => {
          if (!value.detail.data) return;
          switch (value.detail.data) {
            case "skip":
              availableSigmaModes.skip += 1;
              break;
            case "immunity":
              availableSigmaModes.immunity += 1;
              break;
            case "fiftyFifty":
              availableSigmaModes.fiftyFifty += 1;
              break;
            case "timeFreeze":
              availableSigmaModes.timeFreeze += 1;
              break;
          }
          setToastOpen(true);
        }
      });
    } else {
      setToastOpen(true);
    }
  };

  const skipFunction = () => {
    handleAnswerClick(true, flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]].interaction.correct, "skipped");
    availableSigmaModes.skip--;
  };
  const immunityFunction = () => {
    setHasImmunity(true);
    availableSigmaModes.immunity--;
  };
  const fiftyFiftyFunction = () => {
    currentFlashcard.current?.fiftyFifty();
    availableSigmaModes.fiftyFifty--;
  };
  const timeFreezeFunction = () => {
    setTFTS(Date.now());
    setTimeFreeze(true);
    availableSigmaModes.timeFreeze--;
  };
  return (
    <IonPage>
      <video src={`./bg/${flashcardData.categoryName}.mp4`} id="flashcard-bg" autoPlay muted loop></video>
      <div className={"immunity " +
        (hasImmunity ? "enabled" : null)}></div>
      <IonHeader id="flashcard-header">
        <IonProgressBar
          value={easeIn01(timeTillDeath - 0.08)}
          id="countdown"
          className={timeFreeze ? "frozen" : ""}
          style={{
            "--progress": Math.min(Math.round(easeIn01(timeTillDeath) * 100), 100) + "%"
          }} />
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/mainTab" routerDirection="back" shape="round" onClick={() => {
              if (audio !== undefined) audio.stop();
            }}>
              <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>
            {flashcardData.topicName}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => { handleNextFlashcard(10); }} shape="round" color="danger" fill="solid">
              <IonIcon slot="icon-only" icon={arrowForward}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="flashcard-page">
        <div className="upper-container">
          <div className="container">
            <div className="flashcard-header ion-padding">
              <IonCard>
                <IonProgressBar value={progress} />
              </IonCard>
              <span className="additional-info">
                <IonChip>
                  {currentQuestionIndex + 1 + " / " + flashcardData.flashcards.length}
                </IonChip>
                <IonChip className={`timer ${timeFreeze ? "frozen" : ""}`} outline={!timeFreeze}>
                  <IonIcon icon={timeFreeze ? snow : timer} />
                  <IonLabel>
                    {formattedTime}
                  </IonLabel>
                </IonChip>
                <span style={{ flex: '1' }}></span>

                <IonChip className="streak" color={currentStreak > 0 ? "warning" : "dark"}>
                  <IonIcon icon={flame} />
                  <IonLabel>{currentStreak}</IonLabel>
                </IonChip>
                <IonChip color={totalLives - mistakes <= 0 ? "dark" : "danger"}>
                  <IonLabel>{totalLives - mistakes}</IonLabel>
                  <IonIcon icon={heart} />
                </IonChip>
              </span>
            </div>
            <div ref={card} id="flashcards" className={"non-scroll" + (currentQuestionOrder[currentQuestionIndex + 1] < flashcardData.flashcards.length ? "" : " lonely")}>
              <div id="curr">
                <Flashcard
                  ref={currentFlashcard}
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
          <SigmaModes className={(availableSigmaModes.fiftyFifty + availableSigmaModes.immunity + availableSigmaModes.skip + availableSigmaModes.timeFreeze) === 0 ? "invisible" : ""} skipFunction={skipFunction} immunityFunction={immunityFunction} fiftyFiftyFunction={fiftyFiftyFunction} timeFreezeFunction={timeFreezeFunction} activeModes={availableSigmaModes} />
        </div>

        <IonModal id="question-modal" ref={(e) => setModal(e)} isOpen={toastOpen} canDismiss={!toastOpen} handle={false} initialBreakpoint={1} breakpoints={[0, 1]} >
          <IonCard className={toastOpen ? ("animate__animated " + (isCorrect || (hasImmunity && !timeOut) ? "animate__tada" : "animate__shakeX")) : ""}>
            <IonCardHeader>
              <IonCardTitle>{isCorrect ? "Correct!" : ((hasImmunity && !timeOut) ? "Immune!" : (timeOut ? "Out of Time!" : "Incorrect!"))}</IonCardTitle>
              {
                !(isCorrect || (hasImmunity && !timeOut)) ?
                  <IonChip color="danger" className="minus-lives">
                    <IonLabel>-1</IonLabel>
                    <IonIcon icon={heartDislike} />
                  </IonChip> : null
              }
            </IonCardHeader>
            <IonCardContent>
              {(!isCorrect && !timeOut) ? <>
                <IonChip color="danger">
                  <IonIcon icon={closeCircle} />
                  <IonLabel>Your answer:</IonLabel>
                </IonChip> {currentAnswer}
                <br />
              </> : null}
              {showAnswer ? <><IonChip color="success">
                <IonIcon icon={checkmarkCircle} />
                <IonLabel>Correct answer:</IonLabel>
              </IonChip> {correctedAnswer}</> : null}

              {flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]].interaction.explanation ?
                <><hr className="explanation-hr" />
                  <div id="explanation">
                    <IonChip color="secondary">
                      <IonIcon icon={book} />
                      <IonLabel>Explanation:</IonLabel>
                    </IonChip> {flashcardData.flashcards[currentQuestionOrder[currentQuestionIndex]].interaction.explanation}
                  </div></> : null}

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

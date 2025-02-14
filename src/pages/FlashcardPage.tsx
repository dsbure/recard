import { IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonProgressBar, IonTitle, IonToast, IonToolbar, useIonRouter } from '@ionic/react';
import './FlashcardPage.css';
import { useEffect, useState } from 'react';
import { Flashcard } from '../components/Flashcard';
import { useHistory } from 'react-router';
import { arrowBack } from 'ionicons/icons';


const FlashcardPage: React.FC = () => {
  const [progress, setProgress] = useState(0.5);
  const [correctAnswers, setCA] = useState(0);
  const [currentQuestionIndex, setCQI] = useState(0);
  const [currentQuestionText, setCQT] = useState("");
  const [currentQuestionChoices, setCQC] = useState([""]);
  const [correctedAnswer, setCorrectedAnswer] = useState("");

  const [toastOpen, setToastOpen] = useState(false);

  const router = useIonRouter();

  let topicName = "Science Subtopic 1";
  let questions = [
    {
      question: "choose answer a",
      multipleChoices: [
        "answer a",
        "answer b",
        "answer c",
        "answer d"
      ],
      correct: "answer a"
    },
    {
      question: "choose answer c",
      multipleChoices: [
        "answer a",
        "answer b",
        "answer c",
        "answer d"
      ],
      correct: "answer c"
    },
    {
      question: "choose answer b",
      multipleChoices: [
        "answer a",
        "answer b",
        "answer c",
        "answer d"
      ],
      correct: "answer b"
    },
    {
      question: "what is 1+1",
      multipleChoices: [
        "0",
        "1",
        "2",
        "3"
      ],
      correct: "2"
    }
  ];

  useEffect(() => {
    setCQT(questions[currentQuestionIndex].question);
    setCQC(questions[currentQuestionIndex].multipleChoices);
    setProgress((currentQuestionIndex + 1) / questions.length);
  }, [currentQuestionIndex]);

  const handleAnswerClick = (choice: string) => {
    const newScore = correctAnswers + (choice === questions[currentQuestionIndex].correct ? 1 : 0);

    if (choice !== questions[currentQuestionIndex].correct) {
      setCorrectedAnswer(questions[currentQuestionIndex].correct);
      setToastOpen(true);
    }
    if (currentQuestionIndex + 1 < questions.length) {
      setCQI(currentQuestionIndex + 1);
      setCA(newScore);
    } else {
      setCA(newScore);
      const resultsURL = `/results/${newScore}/${questions.length}/${topicName}`;
      router.push(resultsURL);
      cleanUp();
    }
  };
  const cleanUp = () => {
    setCA(0);
    setCQI(0);
  }
  return (
    <IonPage>
      <IonHeader id="header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => cleanUp()} routerLink="/mainTab" shape="round">
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
              <IonButton routerLink="/mainTab" shape="round">
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
          {currentQuestionIndex + 1 + "/" + questions.length}
        </IonLabel>
        <IonLabel className="ion-padding">
          {topicName}
        </IonLabel>
        <Flashcard text={currentQuestionText} index={currentQuestionIndex + 1} choices={currentQuestionChoices} handleAnswerClick={handleAnswerClick} />
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

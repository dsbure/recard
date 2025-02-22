import { IonButton, IonButtons, IonCardContent, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import './MainTab.css';
import { arrowBack, flash, heart, trash } from 'ionicons/icons';
import { TopicView } from '../components/TopicView';
import { useEffect, useState } from 'react';
import { IFlashcardData } from '../components/IFlashcardData'; import { IFlashcardCategory } from "../components/IFlashcardCategory";
import flashcardStorageService from '../services/flashcardStorageService';

const MainTab: React.FC = () => {
  const [pageView, setPageView] = useState(<></>);
  const [selectedSegment, setSelectedSegment] = useState<string>("0");

  const [presentAlert] = useIonAlert();
  useEffect(() => {
    fetch('/recard/flashcardData.json')
      .then((response) => response.json())
      // really complicated for no reason whatsoever
      .then((data: IFlashcardData) => {
        if (!data?.categories) return;

        const segmentButtons = data.categories.map((category, index) => (
          <IonSegmentButton key={index} value={index.toString()} contentId={`tab${index}`}>
            <IonLabel>{category.categoryName}</IonLabel>
          </IonSegmentButton>
        ));

        const segmentViews = data.categories.map((category, index) => (
          <IonSegmentContent key={index} id={`tab${index}`}>
            <TopicView {...category} />
          </IonSegmentContent>
        ));

        setPageView(
          <>
            <IonSegment
              value={selectedSegment}
              onIonChange={(e) => {
                const value = e.detail.value;
                if (value !== undefined) {
                  setSelectedSegment(value.toString());
                }
              }}
            >
              {segmentButtons}
            </IonSegment>
            <IonSegmentView>{segmentViews}</IonSegmentView>
          </>
        );
      })
      .catch((error) => console.error('Load error:', error));
  }, []);


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                presentAlert({
                  header: 'Clear Data',
                  message: 'Are you sure you want to clear data?',
                  buttons: [
                    {
                      text: 'Cancel',
                      role: 'close'
                    },
                    {
                      text: 'Clear Data',
                      role: 'close',
                      handler: () => {
                        flashcardStorageService.clearData();
                      },
                    }
                  ]
                })
              }} shape="round">
              <IonIcon slot="icon-only" icon={trash}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Recard</IonTitle>
        </IonToolbar>
      </IonHeader>

      {pageView}
    </IonPage>
  );
};

export default MainTab;

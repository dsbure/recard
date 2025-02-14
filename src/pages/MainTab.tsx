import { IonCardContent, IonContent, IonHeader, IonLabel, IonPage, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonTitle, IonToolbar } from '@ionic/react';
import './MainTab.css';
import { heart } from 'ionicons/icons';
import { TopicView } from '../components/TopicView';



const MainTab: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>kilos ay di na akma, sa'yong pananalita</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonSegment value="first">
        <IonSegmentButton value="first" contentId="first">
          <IonLabel>Topic 1</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="second" contentId="second">
          <IonLabel>Second</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="third" contentId="third">
          <IonLabel>Third</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <IonSegmentView>
        <IonSegmentContent id="first">
          <TopicView name="Topic 1" desc="desc 1."/>
        </IonSegmentContent>
        <IonSegmentContent id="second">
          <TopicView name="Topic 2" desc="desc 2."/>
        </IonSegmentContent>
        <IonSegmentContent id="third">
          <TopicView name="Topic 3" desc="desc 3."/>
        </IonSegmentContent>
      </IonSegmentView>
    </IonPage>
  );
};

export default MainTab;

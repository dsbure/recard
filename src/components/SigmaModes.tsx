import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from "@ionic/react";
import "./SigmaModes.css";
import { invertMode, logOut, shieldHalf, timer } from "ionicons/icons";

export interface ISMBProps {
  sigmaFunction: () => void;
  name: string;
  icon: string;
}

export interface ISMProps {
  skipFunction: () => void;
  immunityFunction: () => void;
  fiftyFiftyFunction: () => void;
  timeFreezeFunction: () => void;
}

function SigmaModeButton({ sigmaFunction, name, icon }: ISMBProps) {
  return <div className="sigma-modes-button">
    <IonButton onClick={sigmaFunction}>
      <IonIcon icon={icon} slot="icon-only" />
    </IonButton>
    <span className="sigma-modes-name">{name}</span>
  </div>;
}

export default function SigmaModes({ skipFunction, immunityFunction, fiftyFiftyFunction, timeFreezeFunction }: ISMProps) {
  return <IonCard className="sigma-modes">
    <IonCardHeader className="sigma-modes-header">
      <IonCardTitle>
        <span>
          Sigma Modes
        </span>
      </IonCardTitle>
    </IonCardHeader>
    <IonCardContent className="sigma-modes-content">
      <SigmaModeButton sigmaFunction={skipFunction} name={"Skip"} icon={invertMode} />
      <SigmaModeButton sigmaFunction={immunityFunction} name={"Immmunity"} icon={shieldHalf} />
      <SigmaModeButton sigmaFunction={fiftyFiftyFunction} name={"50/50"} icon={logOut} />
      <SigmaModeButton sigmaFunction={timeFreezeFunction} name={"Time Freeze"} icon={timer} />
    </IonCardContent>
  </IonCard>;
}


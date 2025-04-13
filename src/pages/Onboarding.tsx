import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonLabel, IonNote, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import './Onboarding.css';
import { arrowForward, body, checkmarkCircle, flag, glasses, personCircle, pin, star, timer } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import './MainTab.css';
import StorageService from '../services/StorageService';
import { ICharacters, IPlayerData } from '../interfaces/IPlayerData';



const enum AnimateState {
	FIRST_IN = "animate__backInUp",
	TO_IN = "animate__backInRight",
	VISIBLE = "",
	TO_OUT = "animate__backOutLeft",
};

const OBCard: React.FC<{ cardContent: JSX.Element }> = ({ cardContent }) => {
	const animDuration = 1000;
	const [currentCardContent, setCurrentCardContent] = useState(cardContent);
	const [currentState, setCurrentState] = useState<AnimateState>(AnimateState.FIRST_IN);
	useEffect(() => {
		if (currentState === AnimateState.FIRST_IN) {
			setTimeout(() => {
				setCurrentState(
					AnimateState.VISIBLE
				);
			}, animDuration);
		} else if (currentState === AnimateState.VISIBLE || currentState === AnimateState.TO_IN) {
			setCurrentState(
				AnimateState.TO_OUT
			);
			setTimeout(() => {
				setCurrentCardContent(cardContent);

				setCurrentState(
					AnimateState.TO_IN
				);
			}, animDuration);
		}
	}, [cardContent]);
	return (
		<IonCard className={"results-card animate__animated " + currentState}>
			{currentCardContent}
		</IonCard>
	);
}
// ice cream sandwich
interface ICSButton {
	name: string;
	imageSrc: string;
	desc: string;
	onClick: () => void
}

function CharacterSelectButton({ name, imageSrc, desc, onClick }: ICSButton) {
	return (
		<IonButton className="obutton" onClick={onClick}>
			<div className="ch-inner">
				<IonImg src={imageSrc} />
				<IonCardHeader>
					<IonCardTitle>{name}</IonCardTitle>
					<IonCardSubtitle>{desc}</IonCardSubtitle>
				</IonCardHeader>
			</div>
		</IonButton>
	);
}
const Onboarding: React.FC = () => {
	const welcome = <>
		<IonIcon icon="./favicon.svg" className="recall-oicon animate__animated animate__backInRight animate__slow" />
		<IonCardHeader>
			<IonCardTitle>
				Welcome to
				<br />
				<IonImg src={`./recall-wordmark-ambi.svg`} alt="recall" className="animate__animated animate__backInDown" id="recall-onboarding" />
			</IonCardTitle>
			<IonCardSubtitle className="animate__animated animate__backInDown">[witty_tagline]</IonCardSubtitle>
		</IonCardHeader>
		<IonCardContent className="ocard">
			<IonButton className="obutton animate__animated animate__backInUp animate__slower" size="large" onClick={() => setCurrentPage(1)}>
				<IonIcon icon={arrowForward} slot="start" />
				Continue
			</IonButton>
		</IonCardContent>
	</>
	const input = useRef<HTMLIonInputElement>(null);
	const [name, setName] = useState("");
	const inputName = <>
		<IonCardHeader className="centered-header">
			<IonCardContent className="centered-icon">
				<IonIcon icon={personCircle} size="large" />
			</IonCardContent>
			<IonCardTitle>
				What's your name?
			</IonCardTitle>
			<IonCardSubtitle>kimi no na wa</IonCardSubtitle>
		</IonCardHeader>
		<IonCardContent className="ocard">
			<IonInput label="Name" labelPlacement="floating" fill="outline" placeholder="Enter your name" ref={input} clearInput={true} onIonInput={() => {
				setName(input.current?.value?.toString() ?? "");
			}}></IonInput>
			<IonButton className="obutton" id="osubmit" expand="block" onClick={() => setCurrentPage(2)}>
				<IonIcon icon={arrowForward} slot="start" />
				Continue
			</IonButton>
		</IonCardContent>
	</>

	const [character, setCharacter] = useState<ICharacters>();

	const characterSelect = <>
		<IonCardHeader className="centered-header">
			<IonCardContent className="centered-icon">
				<IonIcon icon={body} size="large" />
			</IonCardContent>
			<IonCardTitle>
				Choose your character
			</IonCardTitle>
			<IonCardSubtitle>okay</IonCardSubtitle>
		</IonCardHeader>
		<IonCardContent className="ocard">
			<div id="character-select">
				<CharacterSelectButton name="Zed" imageSrc="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-psd%2Fletter-z_1056304-871.jpg&f=1&nofb=1&ipt=92461706be77c694fcecf9fbfd2731d0e9eace7058df8240939a5093ee2e34e8" desc="coolcoolcool" onClick={() => {
					setCharacter(ICharacters.Zed);
					StorageService.setItem("onboarded", true).then(() => {
						router.push("/mainTab");
					});
				}}/>
				<CharacterSelectButton name="Anne" imageSrc="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fz%2Fletter-z-illustration-flashcard-44147707.jpg&f=1&nofb=1&ipt=bd7c93470e2c3a420b8f5d2d8d1de840f4d4a970389c99b3f52f663771c032fe" desc="yuhyuhyuh" onClick={() => {
					setCharacter(ICharacters.Anne);
					StorageService.setItem("onboarded", true).then(() => {
						router.push("/mainTab");
					});
				}}/>
				<CharacterSelectButton name="O'Wound" imageSrc="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fc8.alamy.com%2Fcomp%2F2NY76FT%2Fletter-z-medicine-logo-design-concept-with-pile-symbol-2NY76FT.jpg&f=1&nofb=1&ipt=a737161d4e0c9fa56b36bb34b7538c4e900c6bb7ecd42bad6dc9635903e7eeed" desc="gauzegauzegauze" onClick={() => {
					setCharacter(ICharacters.OWound);
					StorageService.setItem("onboarded", true).then(() => {
						router.push("/mainTab");
					});
				}}/>
			</div>
		</IonCardContent>
	</>

	const [currentPage, setCurrentPage] = useState(0);
	const [pageContent, setPageContent] = useState(welcome);

	const order = [welcome, inputName, characterSelect];
	const router = useIonRouter();

	useEffect(() => {
		StorageService.setItem("onboarded", false);
	}, []);

	useEffect(() => {
		setPageContent(order[currentPage]);
	}, [currentPage]);
	useEffect(() => {
		StorageService.setItem("playerData", {
			name: name,
			character: character
		} as IPlayerData);
	}, [name, character]);

	return (
		<IonPage>
			<IonContent fullscreen>
				<div className="centered-container">
					<OBCard cardContent={pageContent} />
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Onboarding;

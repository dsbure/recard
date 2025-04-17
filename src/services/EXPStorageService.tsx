import StorageService from "./StorageService";

export interface IEXPStorage {
	currentLevel: number;
	currentEXP: number;
	levelEXP: number;
	levelName: string;
}

const levelExperiences = [100, 200, 500, 1000, 2000, 3000, 5000, 8000, 10000];
export const titles = [
	"Nooblet",
	"Neuron Rookie",
	"Quizling",
	"Trivia Tinkerer",
	"Periodic Puzzler",
	"Atomic Thinker",
	"Science Sniper",
	"Brainwave Surfer",
	"Osmotic Omega",
	"Neurosync Beta",
	"Alphacortex",
	"Sigma Prime",
	"Gigamewtrix",
	"Ultra Quizmancer",
	"Astral Cerebrum",
	"Brainnotrot Ascended"
];

const EXPStorageService = {
	subscribers: [] as Function[],
	currentExperienceData: {} as IEXPStorage,

	constructor() {
		this.subscribers = [];
		this.currentExperienceData = { currentLevel: 1, currentEXP: 0, levelEXP: 0, levelName: titles[0] + " 1" };
	},

	getLevelName(level: number) {
		const levelIndex = Math.min(titles.length - 1, level - 1);
		return titles[levelIndex] + ` ${level}`
	},

	subscribe(callback: Function) {
		if (!this.subscribers.includes(callback)) this.subscribers.push(callback);
		return () => {
			this.subscribers = this.subscribers.filter((e) => e !== callback);
		};
	},

	notifySubscribers() {
		this.subscribers.forEach((callback) => callback());
	},

	async getExperienceData(): Promise<IEXPStorage> {
		return await StorageService.getItem("experienceData") || { currentLevel: 1, currentEXP: 0, levelEXP: 0, levelName: titles[0] + " 1" };
	},

	async setExperienceData(experienceData: IEXPStorage) {
		await StorageService.setItem("experienceData", experienceData);
		this.currentExperienceData = experienceData;
		this.notifySubscribers();
	},

	async addEXP(exp: number) {
		let experienceData: IEXPStorage = await this.getExperienceData();
		experienceData.currentEXP += exp;
		experienceData.levelEXP += exp;
		while (experienceData.levelEXP >= levelExperiences[Math.min(experienceData.currentLevel - 1, levelExperiences.length - 1)]) {
			if (experienceData.levelEXP === Infinity) break;
			experienceData.levelEXP -= levelExperiences[Math.min(experienceData.currentLevel - 1, levelExperiences.length - 1)];
			experienceData.currentLevel++;
		}
		experienceData.levelName = this.getLevelName(experienceData.currentLevel);
		await this.setExperienceData(experienceData);
		this.notifySubscribers();
	},

	async getEXPToNextLevel() {
		let experienceData: IEXPStorage = await this.getExperienceData();
		return levelExperiences[Math.min(experienceData.currentLevel - 1, levelExperiences.length - 1)] - experienceData.levelEXP;
	},

	async getLevelProgress() {
		let experienceData: IEXPStorage = await this.getExperienceData();
		return experienceData.levelEXP / levelExperiences[Math.min(experienceData.currentLevel - 1, levelExperiences.length - 1)];
	},

	clearData() {
		StorageService.removeItem("experienceData");
		this.notifySubscribers();
	}
};

export default EXPStorageService;

import StorageService from "./StorageService";

export interface IEXPStorage {
	currentLevel: number;
	currentEXP: number;
	levelEXP: number;
}

const levelExperiences = [100, 200, 500, 1000, 2000, 3000, 5000, 8000, 10000];

const EXPStorageService = {
	subscribers: [] as Function[],
	currentExperienceData: {} as IEXPStorage,

	constructor() {
		this.subscribers = [];
		this.currentExperienceData = { currentLevel: 1, currentEXP: 0, levelEXP: 0 };
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

	async getExperienceData() {
		return await StorageService.getItem("experienceData") || { currentLevel: 1, currentEXP: 0, levelEXP: 0 };
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
		if (experienceData.levelEXP >= levelExperiences[Math.min(experienceData.currentLevel - 1, levelExperiences.length - 1)]) {
			experienceData.levelEXP -= levelExperiences[Math.min(experienceData.currentLevel - 1, levelExperiences.length - 1)];
			experienceData.currentLevel++;
		}
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

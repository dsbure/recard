import StorageService from "./StorageService";

export interface IEXPStorage {
	currentLevel: number;
	currentEXP: number;
	levelEXP: number;
}

const levelExperiences = [100, 200, 500, 1000, 2000, 3000, 5000, 8000, 10000];

const EXPStorageService = {
	async getExperienceData() {
		return await StorageService.getItem("experienceData") || { currentLevel: 1, currentEXP: 0, levelEXP: 0 };
	},

	async setExperienceData(experienceData: IEXPStorage) {
		await StorageService.setItem("experienceData", experienceData);
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
	},

	async getEXPToNextLevel() {
		let experienceData: IEXPStorage = await this.getExperienceData();
		return levelExperiences[Math.min(experienceData.currentLevel - 1, levelExperiences.length - 1)] - experienceData.levelEXP;
	},

	async getLevelProgress() {
		let experienceData: IEXPStorage = await this.getExperienceData();
		return experienceData.levelEXP / levelExperiences[Math.min(experienceData.currentLevel - 1, levelExperiences.length - 1)];
	},

	async clearData() {
		StorageService.removeItem("experienceData");
	}
};

export default EXPStorageService;

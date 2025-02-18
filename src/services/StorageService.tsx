import { Storage } from '@ionic/storage';

const storage = new Storage();

const initStorage = async () => {
	await storage.create();
};

initStorage();

const StorageService = {
	async setItem(key: string, value: any) {
		await storage.set(key, value);
	},

	async getItem (key: string) {
		return await storage.get(key);
	},

	async removeItem (key: string) {
		await storage.remove(key);
	}
};

export default StorageService;

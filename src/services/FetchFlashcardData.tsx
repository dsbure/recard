import { db } from '../firebase/firebase';
import { collection, getDocs, Firestore } from "firebase/firestore";
import StorageService from './StorageService';
import { IFlashcardTopic } from '../components/IFlashcardTopic';
import { IFlashcardData } from '../components/IFlashcardData';
import { IFlashcardCategory } from '../components/IFlashcardCategory';

const fetchAllData = async (db: Firestore) => {
  const data: IFlashcardData = { categories: [] };

  const categoriesCol = collection(db, "categories");
  const categoriesSnapshot = await getDocs(categoriesCol);

  for (const categoryDoc of categoriesSnapshot.docs) {
    let category: IFlashcardCategory = { 
	  	categoryName: categoryDoc.data().categoryName,
	  	categoryDesc: categoryDoc.data().categoryDesc,
      index: categoryDoc.data().index,
	  	topics: [] as unknown as IFlashcardTopic[]
	  };

    const topicsCol = collection(db, "categories", categoryDoc.id, "topics");
    const topicsSnapshot = await getDocs(topicsCol);

    for (const topicDoc of topicsSnapshot.docs) {
      const topic: IFlashcardTopic = { 
        id: topicDoc.data().id, 
        ...topicDoc.data(), 
        flashcards: [] as unknown as IFlashcardTopic["flashcards"],
        topicName: topicDoc.data().topicName || '',
        categoryName: categoryDoc.data().categoryName || '',
        repeatTotal: topicDoc.data().repeatTotal || 3
      };

      const flashcardsCol = collection(db, "categories", categoryDoc.id, "topics", topicDoc.id, "flashcards");
      const flashcardsSnapshot = await getDocs(flashcardsCol);
      topic.flashcards.push(...flashcardsSnapshot.docs.map(flashcardDoc => ({
        question: flashcardDoc.data().question,
        type: flashcardDoc.data().type,
        interaction: flashcardDoc.data().interaction,
      })));

      category.topics.push(topic);
    }
    category.topics.sort((a, b) => a.id - b.id);

    data.categories.push(category);
  }
  data.categories.sort((a, b) => a.index - b.index);

  console.log("Fetched data from Firestore");
  return data;
}

const FetchFlashcardData = {
	async getFlashcardData(forceFetch: boolean = false, useLocal: boolean = false) {
    if (useLocal) {
      return await fetch("/flashcardData.json").then(e => e.json());
    }

		let flashcardData = await StorageService.getItem("cachedFlashcardData");

		const fetchAndCacheData = async () => {
			const flashcardData = await fetchAllData(db);
			const timestamp = Date.now();
			await StorageService.setItem("cachedFlashcardData", { flashcardData, timestamp });
			return { flashcardData, timestamp };
		};

		if (!flashcardData || forceFetch) {
			flashcardData = await fetchAndCacheData();
		} else {
			const currentTime = Date.now();
			const expirationTime = 1000 * 60 * 60 * 24; // 24 hours
			const dataExpired = currentTime - flashcardData.timestamp > expirationTime;
			if (dataExpired) {
				flashcardData = await fetchAndCacheData();
			}
		}
		return flashcardData.flashcardData;
	}
};

export default FetchFlashcardData;
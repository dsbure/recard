export interface IFlashcardTopic {
  topicName: string;
  categoryName: string;
  id: number;
  flashcards: [
    {
      question: string;
      multipleChoices: string[];
      correct: string;
    }
  ];
}

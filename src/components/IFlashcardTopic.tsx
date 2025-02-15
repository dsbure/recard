export interface IFlashcardTopic {
  topicName: string;
  flashcards: [
    {
      question: string;
      multipleChoices: string[];
      correct: string;
    }
  ];
}

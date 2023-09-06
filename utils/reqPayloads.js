const notes = {
  create: {
    params: ["tagId", "body"],
  },
  update: {
    params: ["tagId", "body"],
  },
};

const flashcard = {
  create: {
    params: ["tagId", "question", "answer"],
  },
  update: {
    params: ["snackId", "tagId", "question", "answer"],
  },
};
const UserProfile = {
  create: {
    params: ["schoolName", "country", "gradeLevelId"],
  },
};
const userNotes = {
  create: {
    params: ["chapterId"],
  },
  update: {
    params: ["body"],
  },
};
const userFlashcards = {
  create: {
    params: ["chapterId"],
  },
  update: {
    params: ["question", "answer"],
  },
};
const flashcardStack = {
  create: {
    params: ["courseId","flashcards","chapterId"],
  },
  update: {
    params: ["question", "answer"],
  },
};

module.exports = {
  notes,
  flashcard,
  UserProfile,
  userNotes,
  userFlashcards,
  flashcardStack,
};

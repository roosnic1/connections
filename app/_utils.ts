export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements array[i] and array[j]
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

export const getWordColor = (category: 1 | 2 | 3 | 4): string => {
  switch (category) {
    case 1:
      return "bg-yellow-300";
    case 2:
      return "bg-lime-500";
    case 3:
      return "bg-blue-300";
    case 4:
      return "bg-purple-400";
    default:
      return "bg-black";
  }
};

export const getWordEmoji = (category: 1 | 2 | 3 | 4): string => {
  switch (category) {
    case 1:
      return "🟨";
    case 2:
      return "🟩";
    case 3:
      return "🟦";
    case 4:
      return "🟪";
    default:
      return "⬛️";
  }
};

export const getPerfection = (mistakesRemaining: number) => {
  switch (mistakesRemaining) {
    case 4:
      return "Perfect!";
    case 3:
      return "Nice!";
    case 2:
      return "Good!";
    default:
      return "Phew!";
  }
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateHashFromArray = async function (
  data: any,
): Promise<string> {
  const dataString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(dataString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

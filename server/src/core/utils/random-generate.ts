// Helper function to generate a random name
export const getRandomName = (): string => {
	const names = ['Aung', 'Myo', 'Zaw', 'Nyo', 'Min', 'Thuta', 'Hsu', 'Ye Ywel'];
	return names[Math.floor(Math.random() * names.length)];
};

// Helper function to generate a random age
export const getRandomAge = (): number => Math.floor(Math.random() * 60) + 18;

// Helper function to generate a random birthday
export const getRandomDate = (start: Date, end: Date): Date => {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime()),
	);
};

export function getRandomName() {
	const names = [
		'John',
		'Jane',
		'Alice',
		'Bob',
		'Charlie',
		'Eve',
		'Dave',
		'Trudy',
		'Mallory',
	];
	return names[Math.floor(Math.random() * names.length)];
}

export function getRandomAge() {
	return Math.floor(Math.random() * 60) + 18; // Random age between 18 and 77
}

export function getRandomDate(start, end) {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime()),
	);
}

export function getRandomTitle() {
	const titles = [
		'Introduction to Node.js',
		'Advanced Mongoose',
		'Mastering JavaScript',
		'Database Optimization',
		'API Development Best Practices',
		'Scaling Applications',
		'Understanding MongoDB Aggregation',
	];
	return titles[Math.floor(Math.random() * titles.length)];
}

import fs from 'fs';
import path from 'path';

type CacheOptions = {
	cacheDir?: string;
	ttl?: number;
};

export class FileCache {
	private cacheDir: string;
	private ttl: number;

	constructor({ cacheDir = 'cache', ttl = 3600 }: CacheOptions = {}) {
		this.cacheDir = cacheDir;
		this.ttl = ttl;

		if (!fs.existsSync(this.cacheDir)) {
			fs.mkdirSync(this.cacheDir, { recursive: true });
		}
	}

	private getFilePath(key: string): string {
		return path.join(this.cacheDir, `${key}.json`);
	}

	async get<T>(key: string): Promise<T | null> {
		const filePath = this.getFilePath(key);

		if (!fs.existsSync(filePath)) {
			return null;
		}

		const fileContent = await fs.promises.readFile(filePath, 'utf8');
		const { data, expiry } = JSON.parse(fileContent);

		if (Date.now() > expiry) {
			await this.delete(key);
			return null;
		}

		return data as T;
	}

	async set<T>(key: string, value: T): Promise<void> {
		const filePath = this.getFilePath(key);

		const cacheEntry = {
			data: value,
			expiry: Date.now() + this.ttl * 1000,
		};

		await fs.promises.writeFile(filePath, JSON.stringify(cacheEntry), 'utf8');
	}

	async delete(key: string): Promise<void> {
		const filePath = this.getFilePath(key);

		if (fs.existsSync(filePath)) {
			await fs.promises.unlink(filePath);
		}
	}

	async clear(): Promise<void> {
		const files = await fs.promises.readdir(this.cacheDir);

		for (const file of files) {
			await fs.promises.unlink(path.join(this.cacheDir, file));
		}
	}
}

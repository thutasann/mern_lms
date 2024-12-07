import fs from 'fs';
import path from 'path';

type CacheOptions = {
	cacheDir?: string;
	ttl?: number;
};

export class FileCache {
	private cacheDir: string;
	private ttl: number;
	private namespace: string;

	constructor({
		cacheDir = 'cache',
		ttl = 3600,
		namespace = 'default',
	}: { cacheDir?: string; ttl?: number; namespace?: string } = {}) {
		this.cacheDir = path.join(cacheDir, namespace);
		this.ttl = ttl;
		this.namespace = namespace;

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
			return null; // Cache miss
		}

		const fileContent = await fs.promises.readFile(filePath, 'utf8');
		const { data, expiry } = JSON.parse(fileContent);

		// Check if the cache has expired
		if (Date.now() > expiry) {
			await this.delete(key); // Clean up expired cache
			return null;
		}

		return data as T; // Cache hit
	}

	async set<T>(key: string, value: T): Promise<void> {
		const filePath = this.getFilePath(key);

		const cacheEntry = {
			data: value,
			expiry: Date.now() + this.ttl * 1000, // Calculate expiry timestamp
		};

		await fs.promises.writeFile(filePath, JSON.stringify(cacheEntry), 'utf8');
	}

	async delete(key: string): Promise<void> {
		const filePath = this.getFilePath(key);

		if (fs.existsSync(filePath)) {
			await fs.promises.unlink(filePath);
		}
	}

	async clearNamespace(): Promise<void> {
		const files = await fs.promises.readdir(this.cacheDir);

		for (const file of files) {
			await fs.promises.unlink(path.join(this.cacheDir, file));
		}
	}

	static async clearAll(cacheDir = 'cache'): Promise<void> {
		if (fs.existsSync(cacheDir)) {
			const namespaces = await fs.promises.readdir(cacheDir);

			for (const namespace of namespaces) {
				const namespaceDir = path.join(cacheDir, namespace);
				const files = await fs.promises.readdir(namespaceDir);

				for (const file of files) {
					await fs.promises.unlink(path.join(namespaceDir, file));
				}
			}
		}
	}
}

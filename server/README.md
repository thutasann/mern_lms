# LMS Backend Server

This is the Express server crafted from scratch via `npm init -y`

## Scripts

**Dev Mode**

```bash
yarn dev
```

open : [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)

**Prod build**

```bash
yarn build
```

**Prod Mode**

```bash
yarn start
```

## Useful Scripts

```bash
node -e "console.log(process.memoryUsage())"
```

```bash
NODE_OPTIONS="--max-old-space-size=4096"
```

```bash
node -e "console.log(require('v8').getHeapStatistics().heap_size_limit / 1024 / 1024 + ' MB')"
```

```bash
export NODE_OPTIONS="--max-old-space-size=256"
```

```bash
echo 'export NODE_OPTIONS="--max-old-space-size=256"' >> ~/.bash_profile
```

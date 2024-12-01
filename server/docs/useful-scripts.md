## Useful Nodejs Scripts

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

4095 MB
2048 MB (2 GB)
1024 MB (1 GB)
512 MB
256 MB
```

```bash
echo 'export NODE_OPTIONS="--max-old-space-size=256"' >> ~/.bash_profile
```

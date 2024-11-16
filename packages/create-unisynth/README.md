# Create Unisynth ⚡️

## Interactive mode

```
npm create unisynth@latest
```

## Command mode

```
npm create unisynth@latest <starter> <projectName>
```

## API

```javascript
const { createApp } = require('create-unisynth');

const opts = {
  projectName: 'my-project',
  starterId: 'todo',
  outDir: '/path/to/output/dir',
};

const result = await createApp(opts);
console.log(result);
```

## Community

- Ping us at [@khulnasoft](https://twitter.com/khulnasoft)
- Join our [Discord](https://unisynth.dev/chat) community

## Related

- [Unisynth](https://unisynth.dev/)
- [Partytown](https://partytown.builder.io)
- [Mitosis](https://github.com/BuilderIO/mitosis)
- [Builder.io](https://github.com/BuilderIO/)

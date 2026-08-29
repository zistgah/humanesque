FROM node:20-slim
WORKDIR /opt/panini
COPY package.json ./
COPY compiler ./compiler
COPY runtime ./runtime
COPY src ./src
COPY stdlib ./stdlib
COPY examples ./examples
COPY tests ./tests
COPY scripts ./scripts
COPY spec ./spec
COPY docs ./docs
ENTRYPOINT ["node", "src/cli.js"]
CMD ["run", "examples/hello.pni"]

# tree-rev: 2026.08.28

FROM oven/bun:latest
WORKDIR /app

COPY package.json package-lock.json ./
RUN bun install

COPY . .
RUN bun build
EXPOSE 4173
CMD ["bun", "run", "preview"]

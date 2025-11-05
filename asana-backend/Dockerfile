FROM node:20-bookworm-slim

# OpenSSL for Prisma
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Only copy dependency manifests first (enables layer caching)
COPY package*.json ./

# Install exactly what's in the lockfile
RUN npm ci

# Then copy the rest
COPY . .

# Generate Prisma client
RUN npx prisma generate

ENV NODE_ENV=production

EXPOSE 8000

CMD ["sh","-c","npx prisma db push --accept-data-loss && sleep 2 && node index.js"]

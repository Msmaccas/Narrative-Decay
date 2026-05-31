FROM node:20-alpine AS build
WORKDIR /app

# Copy package manifests first to maximise Docker layer caching
COPY package.json package-lock.json ./
COPY packages packages
COPY apps apps
COPY fixtures fixtures
COPY scripts scripts
COPY tsconfig.json tsconfig.json

# Install dependencies without auditing or funding prompts
RUN npm ci --omit=peer --no-audit --no-fund

# Build the project.  This compiles TypeScript to JavaScript and copies assets.
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Copy runtime files from build stage
COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/packages packages
COPY --from=build /app/apps apps
COPY --from=build /app/fixtures fixtures
COPY --from=build /app/scripts scripts
COPY package.json package-lock.json ./

# Set NODE_PATH so compiled modules can be resolved
ENV NODE_PATH=/app/dist/packages

# Expose the default API port
EXPOSE 3000

# Default command runs the server.  Override CMD or set SERVICE env
# to "worker" to run the worker instead.
ARG SERVICE=server
ENV SERVICE=${SERVICE}
CMD ["sh", "-c", "if [ \"$SERVICE\" = \"worker\" ]; then node dist/packages/worker/src/index.js; else node dist/packages/server/src/index.js; fi"]

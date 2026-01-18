# -------------------------------
# BUILD STAGE (TypeScript → JS)
# -------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# -------------------------------
# RUNTIME STAGE
# -------------------------------
FROM node:20-alpine

WORKDIR /app

# Copy only built code and essentials
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/views ./views
COPY --from=builder /app/public ./public
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/app.js"]

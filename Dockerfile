# ---- Base Node ----
FROM node:19-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm ci

# ---- Build ----
FROM dependencies AS build
COPY . .
RUN npm run build

# ---- Production ----
FROM node:19-alpine AS production

# Create a group 'nodejs' and add the existing user 'node' to this group
RUN addgroup -S nodejs && addgroup node nodejs

WORKDIR /app

# Copy necessary files
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.js ./next.config.js
COPY --from=build /app/next-i18next.config.js ./next-i18next.config.js

# Adjust ownership to the non-root user and group
RUN chown -R node:nodejs /app

# Switch to the non-root user
USER node

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

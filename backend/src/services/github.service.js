import axios from "axios";

// ─── Evidence Map (npm / pip / general dep names → skill) ────────────────────
const SKILL_MATCHER = {
  // ── Frontend Frameworks ──────────────────────────────────────────────────
  react: { skill: "React", type: "FRAMEWORK" },
  "react-dom": { skill: "React", type: "FRAMEWORK" },
  next: { skill: "Next.js", type: "FRAMEWORK" },
  vue: { skill: "Vue.js", type: "FRAMEWORK" },
  nuxt: { skill: "Nuxt.js", type: "FRAMEWORK" },
  "@angular/core": { skill: "Angular", type: "FRAMEWORK" },
  svelte: { skill: "Svelte", type: "FRAMEWORK" },
  "@sveltejs/kit": { skill: "SvelteKit", type: "FRAMEWORK" },
  "solid-js": { skill: "Solid.js", type: "FRAMEWORK" },
  gatsby: { skill: "Gatsby", type: "FRAMEWORK" },
  astro: { skill: "Astro", type: "FRAMEWORK" },
  remix: { skill: "Remix", type: "FRAMEWORK" },
  "@remix-run/react": { skill: "Remix", type: "FRAMEWORK" },

  // ── CSS / UI Frameworks ──────────────────────────────────────────────────
  tailwindcss: { skill: "Tailwind CSS", type: "FRAMEWORK" },
  bootstrap: { skill: "Bootstrap", type: "FRAMEWORK" },
  "@mui/material": { skill: "Material UI", type: "LIBRARY" },
  "@chakra-ui/react": { skill: "Chakra UI", type: "LIBRARY" },
  antd: { skill: "Ant Design", type: "LIBRARY" },
  "styled-components": { skill: "Styled Components", type: "LIBRARY" },
  "@emotion/react": { skill: "Emotion", type: "LIBRARY" },
  sass: { skill: "Sass", type: "TOOL" },

  // ── State Management ─────────────────────────────────────────────────────
  redux: { skill: "Redux", type: "LIBRARY" },
  "@reduxjs/toolkit": { skill: "Redux Toolkit", type: "LIBRARY" },
  zustand: { skill: "Zustand", type: "LIBRARY" },
  mobx: { skill: "MobX", type: "LIBRARY" },
  recoil: { skill: "Recoil", type: "LIBRARY" },
  jotai: { skill: "Jotai", type: "LIBRARY" },
  pinia: { skill: "Pinia", type: "LIBRARY" },

  // ── Backend Frameworks (JS) ──────────────────────────────────────────────
  express: { skill: "Express", type: "FRAMEWORK" },
  "@nestjs/core": { skill: "NestJS", type: "FRAMEWORK" },
  nest: { skill: "NestJS", type: "FRAMEWORK" },
  koa: { skill: "Koa", type: "FRAMEWORK" },
  "@hapi/hapi": { skill: "Hapi", type: "FRAMEWORK" },
  fastify: { skill: "Fastify", type: "FRAMEWORK" },
  "socket.io": { skill: "Socket.IO", type: "LIBRARY" },

  // ── Backend Frameworks (Python) ──────────────────────────────────────────
  django: { skill: "Django", type: "FRAMEWORK" },
  flask: { skill: "Flask", type: "FRAMEWORK" },
  fastapi: { skill: "FastAPI", type: "FRAMEWORK" },
  celery: { skill: "Celery", type: "LIBRARY" },

  // ── API / Networking ─────────────────────────────────────────────────────
  axios: { skill: "Axios", type: "LIBRARY" },
  graphql: { skill: "GraphQL", type: "LIBRARY" },
  "@apollo/client": { skill: "Apollo GraphQL", type: "LIBRARY" },
  "apollo-server": { skill: "Apollo GraphQL", type: "LIBRARY" },
  "@trpc/server": { skill: "tRPC", type: "LIBRARY" },
  "@trpc/client": { skill: "tRPC", type: "LIBRARY" },

  // ── Databases / ORMs ─────────────────────────────────────────────────────
  mongoose: { skill: "MongoDB", type: "DB" },
  mongodb: { skill: "MongoDB", type: "DB" },
  pg: { skill: "PostgreSQL", type: "DB" },
  sequelize: { skill: "SQL (Sequelize)", type: "DB" },
  typeorm: { skill: "SQL (TypeORM)", type: "DB" },
  prisma: { skill: "Prisma", type: "DB" },
  "@prisma/client": { skill: "Prisma", type: "DB" },
  "drizzle-orm": { skill: "Drizzle ORM", type: "DB" },
  knex: { skill: "Knex.js", type: "DB" },
  firebase: { skill: "Firebase", type: "DB" },
  "firebase-admin": { skill: "Firebase", type: "DB" },
  "@supabase/supabase-js": { skill: "Supabase", type: "DB" },
  ioredis: { skill: "Redis", type: "DB" },
  redis: { skill: "Redis", type: "DB" },
  mysql2: { skill: "MySQL", type: "DB" },
  "better-sqlite3": { skill: "SQLite", type: "DB" },

  // ── Python DB / Data ─────────────────────────────────────────────────────
  sqlalchemy: { skill: "SQLAlchemy", type: "DB" },
  psycopg2: { skill: "PostgreSQL", type: "DB" },
  "psycopg2-binary": { skill: "PostgreSQL", type: "DB" },
  pymongo: { skill: "MongoDB", type: "DB" },

  // ── Auth / Security ──────────────────────────────────────────────────────
  passport: { skill: "Passport.js", type: "LIBRARY" },
  jsonwebtoken: { skill: "JWT Auth", type: "LIBRARY" },
  "next-auth": { skill: "NextAuth.js", type: "LIBRARY" },

  // ── Testing ──────────────────────────────────────────────────────────────
  jest: { skill: "Jest", type: "TOOL" },
  mocha: { skill: "Mocha", type: "TOOL" },
  vitest: { skill: "Vitest", type: "TOOL" },
  cypress: { skill: "Cypress", type: "TOOL" },
  playwright: { skill: "Playwright", type: "TOOL" },
  "@testing-library/react": { skill: "React Testing Library", type: "TOOL" },
  pytest: { skill: "Pytest", type: "TOOL" },

  // ── Build / Bundler Tools ────────────────────────────────────────────────
  vite: { skill: "Vite", type: "TOOL" },
  webpack: { skill: "Webpack", type: "TOOL" },
  esbuild: { skill: "esbuild", type: "TOOL" },
  turbo: { skill: "Turborepo", type: "TOOL" },

  // ── Mobile ───────────────────────────────────────────────────────────────
  "react-native": { skill: "React Native", type: "FRAMEWORK" },
  expo: { skill: "Expo", type: "FRAMEWORK" },

  // ── AI / ML (Python) ─────────────────────────────────────────────────────
  tensorflow: { skill: "TensorFlow", type: "LIBRARY" },
  torch: { skill: "PyTorch", type: "LIBRARY" },
  "scikit-learn": { skill: "Scikit-Learn", type: "LIBRARY" },
  sklearn: { skill: "Scikit-Learn", type: "LIBRARY" },
  numpy: { skill: "NumPy", type: "LIBRARY" },
  pandas: { skill: "Pandas", type: "LIBRARY" },
  openai: { skill: "OpenAI API", type: "LIBRARY" },
  langchain: { skill: "LangChain", type: "LIBRARY" },
  transformers: { skill: "Hugging Face", type: "LIBRARY" },
  keras: { skill: "Keras", type: "LIBRARY" },

  // ── DevOps / Infra ───────────────────────────────────────────────────────
  "aws-sdk": { skill: "AWS", type: "TOOL" },
  "@aws-sdk/client-s3": { skill: "AWS", type: "TOOL" },
  "@google-cloud/storage": { skill: "Google Cloud", type: "TOOL" },
  "aws-cdk-lib": { skill: "AWS CDK", type: "TOOL" },
};

// ─── Go module → skill mapping ───────────────────────────────────────────────
const GO_MODULE_MATCHER = {
  "github.com/gin-gonic/gin": { skill: "Gin", type: "FRAMEWORK" },
  "github.com/gofiber/fiber": { skill: "Fiber", type: "FRAMEWORK" },
  "github.com/labstack/echo": { skill: "Echo", type: "FRAMEWORK" },
  "github.com/gorilla/mux": { skill: "Gorilla Mux", type: "LIBRARY" },
  "gorm.io/gorm": { skill: "GORM", type: "DB" },
  "github.com/go-redis/redis": { skill: "Redis", type: "DB" },
  "go.mongodb.org/mongo-driver": { skill: "MongoDB", type: "DB" },
  "github.com/jmoiron/sqlx": { skill: "SQLx (Go)", type: "DB" },
  "github.com/lib/pq": { skill: "PostgreSQL", type: "DB" },
};

// ─── Rust crate → skill mapping ──────────────────────────────────────────────
const RUST_CRATE_MATCHER = {
  "actix-web": { skill: "Actix Web", type: "FRAMEWORK" },
  rocket: { skill: "Rocket", type: "FRAMEWORK" },
  axum: { skill: "Axum", type: "FRAMEWORK" },
  tokio: { skill: "Tokio", type: "LIBRARY" },
  serde: { skill: "Serde", type: "LIBRARY" },
  diesel: { skill: "Diesel ORM", type: "DB" },
  sqlx: { skill: "SQLx (Rust)", type: "DB" },
  warp: { skill: "Warp", type: "FRAMEWORK" },
};

// ─── Ruby gem → skill mapping ────────────────────────────────────────────────
const RUBY_GEM_MATCHER = {
  rails: { skill: "Ruby on Rails", type: "FRAMEWORK" },
  sinatra: { skill: "Sinatra", type: "FRAMEWORK" },
  pg: { skill: "PostgreSQL", type: "DB" },
  redis: { skill: "Redis", type: "DB" },
  sidekiq: { skill: "Sidekiq", type: "LIBRARY" },
  rspec: { skill: "RSpec", type: "TOOL" },
  devise: { skill: "Devise Auth", type: "LIBRARY" },
};

// ─── PHP Composer → skill mapping ────────────────────────────────────────────
const PHP_COMPOSER_MATCHER = {
  "laravel/framework": { skill: "Laravel", type: "FRAMEWORK" },
  "symfony/framework-bundle": { skill: "Symfony", type: "FRAMEWORK" },
  "doctrine/orm": { skill: "Doctrine ORM", type: "DB" },
};

// ─── Dart/Flutter pubspec → skill mapping ────────────────────────────────────
const DART_PUB_MATCHER = {
  flutter: { skill: "Flutter", type: "FRAMEWORK" },
  dio: { skill: "Dio (HTTP)", type: "LIBRARY" },
  bloc: { skill: "BLoC", type: "LIBRARY" },
  riverpod: { skill: "Riverpod", type: "LIBRARY" },
  firebase_core: { skill: "Firebase", type: "DB" },
};

// ─── GitHub Language → skill mapping ─────────────────────────────────────────
const LANGUAGE_MAP = {
  JavaScript: { skill: "JavaScript", type: "LANGUAGE" },
  TypeScript: { skill: "TypeScript", type: "LANGUAGE" },
  Python: { skill: "Python", type: "LANGUAGE" },
  Go: { skill: "Go", type: "LANGUAGE" },
  Rust: { skill: "Rust", type: "LANGUAGE" },
  Java: { skill: "Java", type: "LANGUAGE" },
  Kotlin: { skill: "Kotlin", type: "LANGUAGE" },
  "C#": { skill: "C#", type: "LANGUAGE" },
  "C++": { skill: "C++", type: "LANGUAGE" },
  C: { skill: "C", type: "LANGUAGE" },
  Ruby: { skill: "Ruby", type: "LANGUAGE" },
  PHP: { skill: "PHP", type: "LANGUAGE" },
  Swift: { skill: "Swift", type: "LANGUAGE" },
  Dart: { skill: "Dart", type: "LANGUAGE" },
  Lua: { skill: "Lua", type: "LANGUAGE" },
  Scala: { skill: "Scala", type: "LANGUAGE" },
  Elixir: { skill: "Elixir", type: "LANGUAGE" },
  Haskell: { skill: "Haskell", type: "LANGUAGE" },
  Shell: { skill: "Shell / Bash", type: "LANGUAGE" },
  HTML: { skill: "HTML", type: "LANGUAGE" },
  CSS: { skill: "CSS", type: "LANGUAGE" },
  Solidity: { skill: "Solidity", type: "LANGUAGE" },
};

/**
 * Scans the authenticated user's top 20 public GitHub repos via GraphQL.
 * Uses monorepo heuristics to detect skills from dependency manifests.
 *
 * @param {string} oauthAccessToken - GitHub OAuth access token
 * @returns {Promise<Array>} Array of verified skill objects
 */
export const verifyUserStack = async (oauthAccessToken) => {
  const query = `
    query {
      viewer {
        repositories(first: 20, privacy: PUBLIC, isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
          nodes {
            name
            url

            # --- Languages (GitHub-detected) ---
            primaryLanguage { name }
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              nodes { name }
            }

            # --- ROOT Configs ---
            rootPkg: object(expression: "HEAD:package.json") { ... on Blob { text } }
            rootReq: object(expression: "HEAD:requirements.txt") { ... on Blob { text } }
            rootGo: object(expression: "HEAD:go.mod") { ... on Blob { text } }
            rootCargo: object(expression: "HEAD:Cargo.toml") { ... on Blob { text } }
            rootGemfile: object(expression: "HEAD:Gemfile") { ... on Blob { text } }
            rootComposer: object(expression: "HEAD:composer.json") { ... on Blob { text } }
            rootPubspec: object(expression: "HEAD:pubspec.yaml") { ... on Blob { text } }
            rootPyproject: object(expression: "HEAD:pyproject.toml") { ... on Blob { text } }
            rootPipfile: object(expression: "HEAD:Pipfile") { ... on Blob { text } }
            rootDockerfile: object(expression: "HEAD:Dockerfile") { ... on Blob { text } }

            # --- MONOREPO / SUBFOLDER Configs (Heuristics) ---
            # Common Frontend Paths
            pkgFrontend: object(expression: "HEAD:frontend/package.json") { ... on Blob { text } }
            pkgClient: object(expression: "HEAD:client/package.json") { ... on Blob { text } }
            pkgWeb: object(expression: "HEAD:web/package.json") { ... on Blob { text } }
            pkgAppsWeb: object(expression: "HEAD:apps/web/package.json") { ... on Blob { text } }

            # Common Backend Paths
            pkgBackend: object(expression: "HEAD:backend/package.json") { ... on Blob { text } }
            pkgServer: object(expression: "HEAD:server/package.json") { ... on Blob { text } }
            pkgApi: object(expression: "HEAD:api/package.json") { ... on Blob { text } }
            pkgAppsApi: object(expression: "HEAD:apps/api/package.json") { ... on Blob { text } }

            # Subfolder Python
            reqBackend: object(expression: "HEAD:backend/requirements.txt") { ... on Blob { text } }

            # Subfolder configs
            pkgPackages: object(expression: "HEAD:packages/core/package.json") { ... on Blob { text } }
            pkgSrc: object(expression: "HEAD:src/package.json") { ... on Blob { text } }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      "https://api.github.com/graphql",
      { query },
      { headers: { Authorization: `bearer ${oauthAccessToken}` } }
    );

    const repos = response.data.data.viewer.repositories.nodes;
    const verifiedSkills = new Map();

    // ── Generic helper: set a skill on the map ─────────────────────────────
    const addSkill = (entry, repoName, context = "") => {
      const evidence = context
        ? `Used in ${repoName} (${context})`
        : `Used in ${repoName}`;
      verifiedSkills.set(entry.skill, {
        name: entry.skill,
        type: entry.type,
        verified: true,
        evidence,
        source: "GITHUB",
      });
    };

    // ── Helper: scan package.json ──────────────────────────────────────────
    const scanPackageJson = (jsonString, repoName, pathContext) => {
      try {
        const json = JSON.parse(jsonString);
        const allDeps = { ...json.dependencies, ...json.devDependencies };

        Object.keys(allDeps).forEach((dep) => {
          if (SKILL_MATCHER[dep]) {
            addSkill(SKILL_MATCHER[dep], repoName, pathContext);
          }
        });

        // Detect TypeScript from tsconfig or typescript dep
        if (allDeps.typescript) {
          addSkill({ skill: "TypeScript", type: "LANGUAGE" }, repoName, pathContext);
        }
      } catch {
        /* ignore invalid JSON */
      }
    };

    // ── Helper: scan requirements.txt / Pipfile ────────────────────────────
    const scanRequirements = (textString, repoName) => {
      const lines = textString.split("\n");
      lines.forEach((line) => {
        const cleaned = line.replace(/#.*/, "").trim();
        if (!cleaned) return;
        const depName = cleaned
          .split("==")[0]
          .split(">=")[0]
          .split("<=")[0]
          .split("~=")[0]
          .split("!=")[0]
          .split("[")[0]
          .trim()
          .toLowerCase();
        if (SKILL_MATCHER[depName]) {
          addSkill(SKILL_MATCHER[depName], repoName);
        }
      });
    };

    // ── Helper: scan pyproject.toml (basic) ────────────────────────────────
    const scanPyproject = (textString, repoName) => {
      // Extract deps from [project.dependencies] or [tool.poetry.dependencies]
      const lines = textString.split("\n");
      lines.forEach((line) => {
        const cleaned = line.replace(/#.*/, "").trim().toLowerCase();
        Object.keys(SKILL_MATCHER).forEach((key) => {
          if (cleaned.startsWith(key) || cleaned.startsWith(`"${key}"`) || cleaned.startsWith(`'${key}'`)) {
            addSkill(SKILL_MATCHER[key], repoName);
          }
        });
      });
    };

    // ── Helper: scan go.mod ────────────────────────────────────────────────
    const scanGoMod = (textString, repoName) => {
      Object.keys(GO_MODULE_MATCHER).forEach((mod) => {
        if (textString.includes(mod)) {
          addSkill(GO_MODULE_MATCHER[mod], repoName);
        }
      });
    };

    // ── Helper: scan Cargo.toml ────────────────────────────────────────────
    const scanCargo = (textString, repoName) => {
      Object.keys(RUST_CRATE_MATCHER).forEach((crate) => {
        // Match `crate_name =` or `crate-name =` pattern
        if (new RegExp(`^\\s*${crate.replace("-", "[-_]")}\\s*=`, "m").test(textString)) {
          addSkill(RUST_CRATE_MATCHER[crate], repoName);
        }
      });
    };

    // ── Helper: scan Gemfile ───────────────────────────────────────────────
    const scanGemfile = (textString, repoName) => {
      Object.keys(RUBY_GEM_MATCHER).forEach((gem) => {
        if (new RegExp(`gem\\s+['"]${gem}['"]`).test(textString)) {
          addSkill(RUBY_GEM_MATCHER[gem], repoName);
        }
      });
    };

    // ── Helper: scan composer.json ─────────────────────────────────────────
    const scanComposer = (jsonString, repoName) => {
      try {
        const json = JSON.parse(jsonString);
        const allDeps = { ...json.require, ...json["require-dev"] };
        Object.keys(allDeps).forEach((dep) => {
          if (PHP_COMPOSER_MATCHER[dep]) {
            addSkill(PHP_COMPOSER_MATCHER[dep], repoName);
          }
        });
      } catch {
        /* ignore */
      }
    };

    // ── Helper: scan pubspec.yaml (basic) ──────────────────────────────────
    const scanPubspec = (textString, repoName) => {
      Object.keys(DART_PUB_MATCHER).forEach((pkg) => {
        if (new RegExp(`^\\s*${pkg}:`, "m").test(textString)) {
          addSkill(DART_PUB_MATCHER[pkg], repoName);
        }
      });
    };

    // ── Scanning Loop ──────────────────────────────────────────────────────
    repos.forEach((repo) => {
      // ─ Languages (GitHub-detected) ─────────────────────────────────────
      if (repo.primaryLanguage?.name && LANGUAGE_MAP[repo.primaryLanguage.name]) {
        addSkill(LANGUAGE_MAP[repo.primaryLanguage.name], repo.name);
      }
      if (repo.languages?.nodes) {
        repo.languages.nodes.forEach((lang) => {
          if (LANGUAGE_MAP[lang.name]) {
            addSkill(LANGUAGE_MAP[lang.name], repo.name);
          }
        });
      }

      // ─ Root manifests ──────────────────────────────────────────────────
      if (repo.rootPkg?.text) scanPackageJson(repo.rootPkg.text, repo.name, "root");
      if (repo.rootReq?.text) scanRequirements(repo.rootReq.text, repo.name);
      if (repo.rootGo?.text) scanGoMod(repo.rootGo.text, repo.name);
      if (repo.rootCargo?.text) scanCargo(repo.rootCargo.text, repo.name);
      if (repo.rootGemfile?.text) scanGemfile(repo.rootGemfile.text, repo.name);
      if (repo.rootComposer?.text) scanComposer(repo.rootComposer.text, repo.name);
      if (repo.rootPubspec?.text) scanPubspec(repo.rootPubspec.text, repo.name);
      if (repo.rootPyproject?.text) scanPyproject(repo.rootPyproject.text, repo.name);
      if (repo.rootPipfile?.text) scanRequirements(repo.rootPipfile.text, repo.name);

      // ─ Docker detection ────────────────────────────────────────────────
      if (repo.rootDockerfile?.text) {
        addSkill({ skill: "Docker", type: "TOOL" }, repo.name);
      }

      // ─ Frontend Subfolders ─────────────────────────────────────────────
      if (repo.pkgFrontend?.text) scanPackageJson(repo.pkgFrontend.text, repo.name, "frontend/");
      if (repo.pkgClient?.text) scanPackageJson(repo.pkgClient.text, repo.name, "client/");
      if (repo.pkgWeb?.text) scanPackageJson(repo.pkgWeb.text, repo.name, "web/");
      if (repo.pkgAppsWeb?.text) scanPackageJson(repo.pkgAppsWeb.text, repo.name, "apps/web/");

      // ─ Backend Subfolders ──────────────────────────────────────────────
      if (repo.pkgBackend?.text) scanPackageJson(repo.pkgBackend.text, repo.name, "backend/");
      if (repo.pkgServer?.text) scanPackageJson(repo.pkgServer.text, repo.name, "server/");
      if (repo.pkgApi?.text) scanPackageJson(repo.pkgApi.text, repo.name, "api/");
      if (repo.pkgAppsApi?.text) scanPackageJson(repo.pkgAppsApi.text, repo.name, "apps/api/");

      // ─ Extra monorepo subfolders ───────────────────────────────────────
      if (repo.pkgPackages?.text) scanPackageJson(repo.pkgPackages.text, repo.name, "packages/core/");
      if (repo.pkgSrc?.text) scanPackageJson(repo.pkgSrc.text, repo.name, "src/");

      // ─ Python Backend ──────────────────────────────────────────────────
      if (repo.reqBackend?.text) scanRequirements(repo.reqBackend.text, repo.name);
    });

    return Array.from(verifiedSkills.values());
  } catch (error) {
    console.error("Stack verification failed:", error.response?.data || error.message);
    return [];
  }
};

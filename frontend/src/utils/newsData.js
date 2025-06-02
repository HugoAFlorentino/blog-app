import alex from '../assets/images/alex.webp';
import girl from '../assets/images/girl.webp';
import globe from '../assets/images/globe.webp';
import laptop from '../assets/images/laptop.webp';
import robot1 from '../assets/images/robot-1.webp';
import robot from '../assets/images/robot.webp';
import screen from '../assets/images/screen.webp';
import techGirl from '../assets/images/tech-girl.webp';
import code from '../assets/images/code.webp';
import computer from '../assets/images/computer.webp';

const newsData = [
  {
    id: 1,
    title:
      'React 19 Beta Released with Built-in Use Hook and Server Components',
    description:
      'React 19 introduces groundbreaking features including the new built-in `use` hook, an upgraded compiler, and stable server components. These improvements aim to simplify data fetching, enhance performance, and allow developers to build more scalable fullstack applications with cleaner code and improved DX (developer experience). React’s new architecture also emphasizes streaming rendering for faster page loads.',
    date: '2025-05-20',
    image: alex,
  },
  {
    id: 2,
    title:
      'Node.js 22 Launches with Native Fetch, WebSocket Support, and Better Diagnostics',
    description:
      'Node.js 22 brings long-awaited native support for the Fetch API and WebSocket, aligning backend JavaScript more closely with browser standards. The release also enhances diagnostic tools, integrates better test coverage reporting, and improves performance in async operations — making it a significant milestone for backend JavaScript development.',
    date: '2025-05-15',
    image: girl,
  },
  {
    id: 3,
    title:
      'TypeScript 5.5 Stable: Smarter Generics, Performance Upgrades, and Linting Tools',
    description:
      'TypeScript 5.5 focuses on intelligent type inference for complex generics, better tooling support in editors, and smaller compiled JavaScript bundles. New language service enhancements improve IntelliSense performance in large codebases, and the introduction of isolated file compilation benefits monorepos and enterprise-scale projects.',
    date: '2025-05-10',
    image: globe,
  },
  {
    id: 4,
    title:
      'PostgreSQL 17 Adds AI-Powered Index Suggestions and Parallel Aggregations',
    description:
      'PostgreSQL 17 introduces AI-driven performance tuning tools, including index suggestion analysis based on query history. The new release also improves support for parallel aggregation and logical replication, making it more suitable for big data applications. A reworked planner adds smarter query execution paths, significantly improving efficiency.',
    date: '2025-05-05',
    image: laptop,
  },
  {
    id: 5,
    title:
      'Vite 6 Released: Fastest Dev Server Yet with SSR and Plugin Upgrades',
    description:
      'Vite 6 continues to push the boundary on speed and DX. The new dev server achieves sub-50ms hot module reload times even in larger projects. Server-side rendering support is now first-class, and plugin compatibility with major frameworks like React, Svelte, and SolidJS has been tightened. It’s now easier to build universal JavaScript apps with lightning-fast feedback.',
    date: '2025-04-30',
    image: robot1,
  },
  {
    id: 6,
    title:
      'OpenAI Introduces GPT-5: Smarter, Longer Memory, and Multimodal Capabilities',
    description:
      'GPT-5 by OpenAI enhances long-context understanding, reduces hallucinations, and introduces robust multimodal reasoning across text, image, and audio. The model can retain up to 256K tokens in a session and respond more accurately to complex, layered instructions. API usage is now more developer-friendly with improved cost controls and token estimation tools.',
    date: '2025-04-25',
    image: robot,
  },
  {
    id: 7,
    title:
      'GitHub Codespaces Now Free for Personal Accounts with 60 Hours Monthly',
    description:
      'GitHub has made its Codespaces cloud-based dev environment available to all users with a free tier that includes 60 hours per month. Codespaces allows developers to spin up full dev environments in seconds, preloaded with VS Code, Docker, and Git. This change makes it easier for junior devs to start coding without expensive local setups.',
    date: '2025-04-22',
    image: screen,
  },
  {
    id: 8,
    title: 'Next.js 15 Prepares for Partial Prerendering and Better Middleware',
    description:
      'Next.js 15 focuses on deeper optimizations for Partial Prerendering (PPR), allowing hybrid SSR/SSG components to coexist smoothly. Middleware edge APIs have been improved for routing logic and security headers, and image optimization has been refactored to reduce layout shift. This version also introduces better support for React Server Components.',
    date: '2025-04-18',
    image: techGirl,
  },
  {
    id: 9,
    title:
      'Bun 2.1 Adds Compatibility Layer for Node.js and ESBuild Integration',
    description:
      'Bun 2.1 strengthens its position as a fast alternative to Node.js by adding a full Node.js compatibility layer. With this update, most existing npm packages work out of the box. ESBuild is now integrated into the runtime pipeline, improving TypeScript transpilation speed and bundle size dramatically. Bun also ships with a lightweight test runner and package manager.',
    date: '2025-04-10',
    image: code,
  },
  {
    id: 10,
    title:
      'Stripe Launches New Developer Dashboard with Real-Time Logs and CLI Sync',
    description:
      'Stripe unveils a new developer dashboard featuring real-time event logs, webhook replays, and seamless CLI integration. The new UI helps developers debug payment flows much faster. With built-in API key rotation and granular permission management, the platform doubles down on security and developer efficiency.',
    date: '2025-04-05',
    image: computer,
  },
];

export default newsData;

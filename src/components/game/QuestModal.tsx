"use client";

import React, { useState } from "react";
import { X, Search, Sparkles, BookOpen, PlusCircle, ArrowLeft } from "lucide-react";
import { INITIAL_TEMPLATES } from "@/server/game/seed-data";
import { DIFFICULTY_XP } from "@/server/game/progression";

const TEMPLATE_TOPICS: Record<string, string[]> = {
  "int-software-engineering": ["Data Structures", "Algorithms", "System Design", "Clean Code", "Design Patterns"],
  "int-cloud-computing": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD"],
  "int-cybersecurity": ["Network Security", "Ethical Hacking", "Cryptography", "Threat Modeling", "Pen Testing"],
  "int-data-science-ml": ["Python", "Statistics", "Neural Networks", "Pandas", "TensorFlow", "PyTorch"],
  "int-ui-ux-design": ["Figma", "User Research", "Wireframing", "Typography", "Color Theory", "Accessibility"],
  "int-web-development": ["React", "Next.js", "Node.js", "HTML/CSS", "TypeScript", "Tailwind CSS"],
  "int-mobile-development": ["iOS/Swift", "Android/Kotlin", "Flutter", "React Native"],
  "int-blockchain-web3": ["Smart Contracts", "Solidity", "Ethereum", "Cryptography", "DeFi"],
  "int-history": ["Ancient Rome", "World War II", "Renaissance", "Cold War", "Industrial Revolution"],
  "int-philosophy": ["Stoicism", "Existentialism", "Ethics", "Logic", "Epistemology"],
  "int-literature": ["Classic Novels", "Poetry", "Creative Writing", "Narrative Structure"],
  "int-linguistics": ["Spanish", "French", "Japanese", "Syntax", "Etymology"],
  "int-personal-finance": ["Investing", "Budgeting", "Stock Market", "Real Estate", "Taxes"],
  "int-business-management": ["Leadership", "Operations", "Strategy", "Organizational Behavior"],
  "int-marketing": ["SEO", "Content Marketing", "Social Media", "Consumer Psychology"],
  "int-physics-astronomy": ["Quantum Mechanics", "Astrophysics", "Relativity", "Thermodynamics"],
  "int-biology-medicine": ["Genetics", "Anatomy", "Neuroscience", "Immunology"],
  "int-psychology-sociology": ["Cognitive Behavioral Therapy", "Social Psychology", "Habit Formation"],
  "int-chemistry": ["Organic Chemistry", "Biochemistry", "Molecular Structures"],
  "int-law-jurisprudence": ["Contracts", "Constitutional Law", "Criminal Law"],
};

const SUBTOPICS: Record<string, string[]> = {
  "Data Structures": [
    "Arrays (1D, 2D, Multidimensional)",
    "Strings",
    "Linked Lists (Singly, Doubly, Circular)",
    "Stacks",
    "Queues (Simple, Circular, Deque)",
    "Priority Queues & Heaps (Min/Max)",
    "Hash Tables / Maps / Sets",
    "Trees (Binary Trees, N-ary Trees)",
    "Binary Search Trees (BST)",
    "Balanced Trees (AVL, Red-Black)",
    "Tries (Prefix Trees)",
    "Graphs (Directed, Undirected, Weighted)",
    "Disjoint Sets (Union-Find)",
    "Segment Trees & Fenwick Trees (BIT)",
    "Advanced Graphs (Bipartite, DAGs)",
    "Matrices / Grids",
    "Bloom Filters"
  ],
  "Algorithms": ["Sorting & Searching", "Dynamic Programming", "Greedy", "Divide & Conquer", "Backtracking", "Graph Algorithms"],
  "System Design": ["Scalability", "Microservices", "Databases (SQL/NoSQL)", "Caching", "Load Balancing", "Message Queues"],
  "Clean Code": ["SOLID Principles", "Refactoring", "Naming Conventions", "Error Handling", "Unit Testing"],
  "Design Patterns": ["Creational Patterns", "Structural Patterns", "Behavioral Patterns", "MVC / MVVM"],
  "AWS": ["EC2", "S3", "Lambda", "DynamoDB", "VPC", "IAM"],
  "Azure": ["Virtual Machines", "Blob Storage", "Azure Functions", "Cosmos DB", "AKS"],
  "React": ["Hooks", "State Management", "Component Lifecycle", "React Router", "Performance Optimization"],
  "Next.js": ["App Router", "Server Components", "API Routes", "Static Site Generation", "Middleware"],
  "Node.js": ["Express", "Event Loop", "Streams", "Authentication", "WebSockets"],
  "Python": ["Data Types & Structures", "OOP", "Decorators", "Generators", "Asyncio"],
};

const DEEP_TOPICS: Record<string, string[]> = {
  // --- Data Structures ---
  "Arrays (1D, 2D, Multidimensional)": [
    "Basic Array Operations (Insert, Delete, Traverse)",
    "Two Pointers Technique",
    "Sliding Window Algorithm",
    "Prefix Sum & Difference Arrays",
    "Matrix Traversal (Spiral, Diagonal)",
    "Kadane's Algorithm (Maximum Subarray)",
    "Sorting & Binary Search on Arrays"
  ],
  "Strings": [
    "String Reversal & Palindromes",
    "Anagrams & Frequency Counting",
    "Pattern Matching (KMP, Rabin-Karp)",
    "String Parsing & Conversions",
    "Longest Substring/Subsequence Problems",
    "Trie-based String Problems"
  ],
  "Linked Lists (Singly, Doubly, Circular)": [
    "Node Insertion & Deletion",
    "Reversing a Linked List",
    "Floyd's Cycle Detection (Tortoise & Hare)",
    "Merging & Intersecting Linked Lists",
    "Doubly Linked List Operations",
    "Fast & Slow Pointers"
  ],
  "Stacks": [
    "Push, Pop, Peek Operations",
    "Valid Parentheses / Bracket Matching",
    "Next Greater Element (Monotonic Stack)",
    "Expression Evaluation (Postfix/Prefix)",
    "Min/Max Stack Implementation"
  ],
  "Queues (Simple, Circular, Deque)": [
    "Enqueue & Dequeue Operations",
    "Implementing Queue using Stacks",
    "Circular Queue Implementation",
    "Sliding Window Maximum (using Deque)",
    "Breadth-First Search (BFS) Queue"
  ],
  "Priority Queues & Heaps (Min/Max)": [
    "Heapify & Heap Sort",
    "Top K Frequent Elements",
    "Kth Largest/Smallest Element",
    "Merge K Sorted Lists",
    "Median of a Data Stream"
  ],
  "Hash Tables / Maps / Sets": [
    "Hash Functions & Collision Resolution",
    "Two Sum & Subarray Sum Problems",
    "Caching (LRU / LFU Cache)",
    "Frequency Maps & Counting",
    "Finding Duplicates & Unique Elements"
  ],
  "Trees (Binary Trees, N-ary Trees)": [
    "Tree Traversals (Inorder, Preorder, Postorder)",
    "Level Order Traversal (BFS)",
    "Maximum Depth & Diameter",
    "Lowest Common Ancestor (LCA)",
    "Symmetric & Identical Trees"
  ],
  "Binary Search Trees (BST)": [
    "Search, Insert, Delete in BST",
    "Validating a BST",
    "Inorder Successor/Predecessor",
    "Kth Smallest Element in BST",
    "Constructing BST from Traversals"
  ],
  "Balanced Trees (AVL, Red-Black)": [
    "AVL Tree Rotations (LL, LR, RL, RR)",
    "Red-Black Tree Properties",
    "Insertion & Deletion Balancing",
    "B-Trees & Databases"
  ],
  "Tries (Prefix Trees)": [
    "Insert & Search Words",
    "Autocomplete & Suggestions",
    "Word Search II (Board traversal)",
    "Bitwise Tries (Maximum XOR)"
  ],
  "Graphs (Directed, Undirected, Weighted)": [
    "Adjacency Matrix vs Adjacency List",
    "Breadth-First Search (BFS)",
    "Depth-First Search (DFS)",
    "Shortest Path (Dijkstra's Algorithm)",
    "Minimum Spanning Tree (Prim's / Kruskal's)",
    "Topological Sorting",
    "Cycle Detection"
  ],
  "Disjoint Sets (Union-Find)": [
    "Find & Union Operations",
    "Path Compression",
    "Union by Rank/Size",
    "Connected Components",
    "Kruskal's MST Algorithm"
  ],
  "Segment Trees & Fenwick Trees (BIT)": [
    "Range Sum Query",
    "Range Minimum/Maximum Query",
    "Point Updates",
    "Lazy Propagation",
    "Fenwick Tree (Binary Indexed Tree)"
  ],
  "Advanced Graphs (Bipartite, DAGs)": [
    "Bipartite Graph Checking",
    "Strongly Connected Components (Kosaraju's)",
    "Eulerian Path & Circuit",
    "Bellman-Ford Algorithm",
    "Floyd-Warshall Algorithm"
  ],
  "Matrices / Grids": [
    "2D Array Traversal",
    "Flood Fill Algorithm",
    "Islands / Connected Components",
    "Matrix Rotation",
    "Pathfinding in Grid"
  ],
  "Bloom Filters": [
    "Probabilistic Data Structures",
    "Hash Functions for Bloom Filters",
    "False Positives",
    "Insertion & Querying"
  ],

  // --- Algorithms ---
  "Sorting & Searching": [
    "Bubble, Insertion, Selection Sort",
    "Merge Sort & Quick Sort",
    "Binary Search on Arrays",
    "Binary Search on Answer Space",
    "Counting Sort & Radix Sort"
  ],
  "Dynamic Programming": [
    "Fibonacci Sequence & Memoization",
    "0/1 Knapsack Problem",
    "Longest Common Subsequence (LCS)",
    "Longest Increasing Subsequence (LIS)",
    "Matrix Chain Multiplication"
  ],
  "Greedy": [
    "Activity Selection Problem",
    "Huffman Coding",
    "Job Sequencing with Deadlines",
    "Fractional Knapsack",
    "Coin Change (Greedy vs DP)"
  ],
  "Divide & Conquer": [
    "Merge Sort & Quick Sort",
    "Closest Pair of Points",
    "Strassen's Matrix Multiplication",
    "Median of Two Sorted Arrays"
  ],
  "Backtracking": [
    "N-Queens Problem",
    "Sudoku Solver",
    "Generating Permutations & Combinations",
    "Word Search",
    "Subset Sum"
  ],
  "Graph Algorithms": [
    "Dijkstra's Shortest Path",
    "Bellman-Ford & Floyd-Warshall",
    "Prim's & Kruskal's MST",
    "Topological Sort",
    "Tarjan's Algorithm (Bridges)"
  ],

  // --- System Design ---
  "Scalability": [
    "Vertical vs Horizontal Scaling",
    "CAP Theorem",
    "Stateless Architecture",
    "Content Delivery Networks (CDN)",
    "Rate Limiting"
  ],
  "Microservices": [
    "Monolith vs Microservices",
    "API Gateways",
    "Service Discovery",
    "Circuit Breaker Pattern",
    "Event-Driven Architecture"
  ],
  "Databases (SQL/NoSQL)": [
    "ACID Properties",
    "Database Sharding & Partitioning",
    "Replication (Master-Slave)",
    "SQL vs NoSQL (Document, Key-Value)",
    "Database Indexes & B-Trees"
  ],
  "Caching": [
    "Cache Invalidation Strategies",
    "Eviction Policies (LRU, LFU)",
    "Distributed Caching (Redis/Memcached)",
    "Write-Through vs Write-Back"
  ],
  "Load Balancing": [
    "Round Robin & IP Hash",
    "L4 vs L7 Load Balancing",
    "Consistent Hashing",
    "Reverse Proxies",
    "Health Checks"
  ],
  "Message Queues": [
    "Publish/Subscribe Model",
    "Kafka vs RabbitMQ",
    "Asynchronous Processing",
    "Message Durability & Acknowledgement",
    "Dead Letter Queues"
  ],

  // --- Clean Code & Design Patterns ---
  "SOLID Principles": [
    "Single Responsibility Principle (SRP)",
    "Open-Closed Principle (OCP)",
    "Liskov Substitution Principle (LSP)",
    "Interface Segregation Principle (ISP)",
    "Dependency Inversion Principle (DIP)"
  ],
  "Refactoring": [
    "Extract Method / Class",
    "Replacing Magic Numbers",
    "Simplifying Conditional Expressions",
    "Code Smells Identification",
    "Technical Debt Management"
  ],
  "Naming Conventions": [
    "Meaningful Variable Names",
    "Function Naming (Verbs)",
    "Class Naming (Nouns)",
    "Casing (Camel, Pascal, Snake)",
    "Avoiding Disinformation"
  ],
  "Error Handling": [
    "Exceptions vs Return Codes",
    "Try-Catch-Finally Blocks",
    "Custom Exception Classes",
    "Fail Fast Principle",
    "Logging & Monitoring"
  ],
  "Unit Testing": [
    "Test-Driven Development (TDD)",
    "Mocking & Stubbing",
    "Code Coverage",
    "AAA Pattern (Arrange, Act, Assert)",
    "Integration vs Unit Tests"
  ],
  "Creational Patterns": [
    "Singleton",
    "Factory Method",
    "Abstract Factory",
    "Builder",
    "Prototype"
  ],
  "Structural Patterns": [
    "Adapter",
    "Decorator",
    "Facade",
    "Proxy",
    "Composite",
    "Bridge"
  ],
  "Behavioral Patterns": [
    "Observer",
    "Strategy",
    "Command",
    "State",
    "Chain of Responsibility",
    "Mediator"
  ],
  "MVC / MVVM": [
    "Model-View-Controller Architecture",
    "Model-View-ViewModel Architecture",
    "Data Binding",
    "Separation of Concerns",
    "Controller vs ViewModel logic"
  ],

  // --- Cloud & DevOps ---
  "EC2": [
    "Instances Types & Families",
    "AMIs & Snapshots",
    "Security Groups & NACLs",
    "Auto Scaling Groups",
    "Elastic IPs & ENIs"
  ],
  "S3": [
    "Buckets & Objects",
    "Storage Classes (Standard, Glacier)",
    "Versioning & Lifecycle Rules",
    "Pre-signed URLs",
    "S3 Select & Athena"
  ],
  "Lambda": [
    "Serverless Architecture",
    "Event Sources & Triggers",
    "Execution Roles & Permissions",
    "Cold Starts vs Provisioned Concurrency",
    "Layers & Custom Runtimes"
  ],
  "DynamoDB": [
    "Partition Keys & Sort Keys",
    "Provisioned vs On-Demand Capacity",
    "Global Secondary Indexes (GSIs)",
    "DynamoDB Streams",
    "DAX (DynamoDB Accelerator)"
  ],
  "VPC": [
    "Subnets (Public/Private)",
    "Route Tables & Internet Gateways",
    "NAT Gateways",
    "VPC Peering",
    "VPC Endpoints"
  ],
  "IAM": [
    "Users, Groups, & Roles",
    "Policies (JSON)",
    "MFA (Multi-Factor Authentication)",
    "Identity Providers (SAML/OIDC)",
    "Cross-Account Access"
  ],
  "Virtual Machines": [
    "VM Sizes & Series",
    "Availability Sets & Zones",
    "Virtual Machine Scale Sets (VMSS)",
    "Disk Storage Types",
    "Azure Bastion"
  ],
  "Blob Storage": [
    "Containers & Blobs",
    "Access Tiers (Hot, Cool, Archive)",
    "Lifecycle Management",
    "Shared Access Signatures (SAS)",
    "Azure Data Lake Storage"
  ],
  "Azure Functions": [
    "Triggers & Bindings",
    "Consumption vs Premium Plan",
    "Durable Functions",
    "Function App Settings",
    "Managed Identities"
  ],
  "Cosmos DB": [
    "Request Units (RUs)",
    "Partition Keys",
    "Consistency Levels (Strong, Eventual)",
    "Multiple APIs (SQL, MongoDB, Cassandra)",
    "Global Distribution"
  ],
  "AKS": [
    "Kubernetes Clusters in Azure",
    "Node Pools",
    "Azure CNI vs Kubenet",
    "AKS Integrations (ACR, Key Vault)",
    "Cluster Autoscaler"
  ],

  // --- Web Development ---
  "Hooks": [
    "useState & useEffect",
    "useContext & useReducer",
    "useRef & useImperativeHandle",
    "useMemo & useCallback",
    "Custom Hooks"
  ],
  "State Management": [
    "Prop Drilling vs Context API",
    "Redux (Actions, Reducers, Store)",
    "Redux Toolkit (Slices)",
    "Zustand / Jotai",
    "Server State (React Query)"
  ],
  "Component Lifecycle": [
    "Mounting, Updating, Unmounting",
    "componentDidMount vs useEffect",
    "Cleanup Functions",
    "Error Boundaries",
    "Strict Mode"
  ],
  "React Router": [
    "BrowserRouter & Routes",
    "Link & NavLink",
    "Dynamic Routing (Params)",
    "Nested Routes",
    "Programmatic Navigation (useNavigate)"
  ],
  "Performance Optimization": [
    "React.memo",
    "Code Splitting (React.lazy & Suspense)",
    "Virtualization (react-window)",
    "Avoiding Anonymous Functions",
    "Debouncing & Throttling"
  ],
  "App Router": [
    "Directory Structure (app/)",
    "Layouts & Templates",
    "Loading UI & Streaming",
    "Error Handling (error.tsx)",
    "Server & Client Components Boundary"
  ],
  "Server Components": [
    "RSC Architecture",
    "Data Fetching in RSC",
    "SEO Benefits",
    "Reduced JavaScript Bundle",
    "Mixing Server & Client Components"
  ],
  "API Routes": [
    "Route Handlers (route.ts)",
    "RESTful Endpoints",
    "Handling Webhooks",
    "Connecting to Databases",
    "Edge vs Node.js Runtime"
  ],
  "Static Site Generation": [
    "generateStaticParams",
    "ISR (Incremental Static Regeneration)",
    "On-Demand Revalidation",
    "Static vs Dynamic Rendering",
    "fetch() Cache Options"
  ],
  "Middleware": [
    "Edge Runtime Limitations",
    "Request Rewrites & Redirects",
    "Authentication & Authorization",
    "A/B Testing & Personalization",
    "Setting Cookies & Headers"
  ],
  "Express": [
    "Routing & HTTP Methods",
    "Middleware Functions",
    "Error Handling Middleware",
    "Request & Response Objects",
    "Template Engines"
  ],
  "Event Loop": [
    "Timers, Pending Callbacks, Poll",
    "Check (setImmediate), Close Callbacks",
    "Microtasks (process.nextTick)",
    "Blocking vs Non-Blocking I/O",
    "Worker Threads"
  ],
  "Streams": [
    "Readable, Writable, Duplex",
    "Piping Streams",
    "Handling Large Files",
    "Memory Efficiency",
    "Stream Events"
  ],
  "Authentication": [
    "JWT (JSON Web Tokens)",
    "Session-Based Auth",
    "OAuth 2.0 & Passport.js",
    "Password Hashing (Bcrypt)",
    "Role-Based Access Control (RBAC)"
  ],
  "WebSockets": [
    "Socket.io vs ws",
    "Bi-directional Communication",
    "Broadcasting & Rooms",
    "Real-time Chat Implementation",
    "Heartbeats & Reconnection"
  ],
  "Data Types & Structures": [
    "Lists, Tuples, Sets, Dictionaries",
    "List Comprehensions",
    "Strings & Slicing",
    "Mutable vs Immutable",
    "Collections Module"
  ],
  "OOP": [
    "Classes & Objects",
    "Inheritance (Multiple & Mixins)",
    "Polymorphism & Duck Typing",
    "Encapsulation (Public, Private)",
    "Dunder (Magic) Methods"
  ],
  "Decorators": [
    "First-Class Functions",
    "Wrapper Functions",
    "Decorators with Arguments",
    "Class Decorators",
    "functools.wraps"
  ],
  "Generators": [
    "Yield Keyword",
    "Generator Expressions",
    "Memory Efficiency (Lazy Evaluation)",
    "Iterators vs Generators",
    "Sending Values to Generators"
  ],
  "Asyncio": [
    "Coroutines (async/await)",
    "Event Loop",
    "Tasks & Futures",
    "aiohttp (Async Requests)",
    "Concurrency vs Parallelism"
  ]
};

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questData: {
    title: string;
    description?: string;
    difficulty: string;
    attribute: string;
    cadence: string;
    weeklyTarget: number;
    dueDate?: string | null;
  }) => Promise<void>;
  editingQuest?: {
    id: string;
    title: string;
    description: string | null;
    difficulty: string;
    attribute: string;
    cadence: string;
    weeklyTarget: number;
    dueDate: string | null;
  } | null;
}

export function QuestModal({ isOpen, onClose, onSubmit, editingQuest }: QuestModalProps) {
  const [tab, setTab] = useState<"custom" | "templates" | "topics" | "subtopics" | "details">(editingQuest ? "custom" : "custom");
  const [title, setTitle] = useState(editingQuest?.title || "");
  const [description, setDescription] = useState(editingQuest?.description || "");
  const [difficulty, setDifficulty] = useState(editingQuest?.difficulty || "MEDIUM");
  const [attribute, setAttribute] = useState(editingQuest?.attribute || "INTELLECT");
  const [cadence, setCadence] = useState(editingQuest?.cadence || "DAILY");
  const [weeklyTarget, setWeeklyTarget] = useState(editingQuest?.weeklyTarget || 1);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateAttrFilter, setTemplateAttrFilter] = useState("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState<string | null>(editingQuest ? null : null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);

  if (!isOpen) return null;

  const generateGamifiedQuest = (baseTitle: string, topic: string, originalDescription: string) => {
    const rpgPrefixes = [
      "The Scroll of", 
      "Mastery over", 
      "The Trials of", 
      "Conquering", 
      "The Secrets of", 
      "Unlocking",
      "The Domain of",
      "Expedition into"
    ];
    const randomPrefix = rpgPrefixes[Math.floor(Math.random() * rpgPrefixes.length)];
    
    const newTitle = `${randomPrefix} ${topic}`;
    
    const newDescription = `📜 **Mission Briefing:**
The elders of **${baseTitle}** have assigned you a critical quest. To level up your abilities, you must dive deep into the arcane knowledge of **${topic}**.

⚔️ **Quest Objectives:**
- [ ] **Gather Intel:** Study the core mechanics and theory of ${topic}.
- [ ] **Trial by Fire:** Solve 3 practice problems or apply this skill practically.
- [ ] **Share the Wisdom:** Write a brief summary or explain the concept to a fellow adventurer.

🔮 **Lore:** 
${originalDescription}

*Equip your best gear and get started. May the RNG be in your favor!*`;

    return { newTitle, newDescription };
  };

  const handleAdoptTemplate = (tmpl: (typeof INITIAL_TEMPLATES)[number], specificTopic?: string) => {
    if (specificTopic) {
      const { newTitle, newDescription } = generateGamifiedQuest(tmpl.title, specificTopic, tmpl.description);
      setTitle(newTitle);
      setDescription(newDescription);
    } else {
      setTitle(tmpl.title);
      setDescription(tmpl.description || "");
    }
    setDifficulty(tmpl.difficulty || "MEDIUM");
    setAttribute(tmpl.attribute || "INTELLECT");
    setCadence(tmpl.cadence || "DAILY");
    if (tmpl.cadence === "WEEKLY") setWeeklyTarget(1);
    setSelectedTemplateSlug(tmpl.slug);
    setTab("custom");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        difficulty,
        attribute,
        cadence,
        weeklyTarget: cadence === "WEEKLY" ? weeklyTarget : 1,
      });
      onClose();
    } catch {
      // Handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };


  const filteredTemplates = INITIAL_TEMPLATES.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesAttr = templateAttrFilter === "ALL" || t.attribute === templateAttrFilter;
    return matchesSearch && matchesAttr;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-panel border border-border shadow-2xl max-w-2xl w-full rounded-2xl p-6 relative max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header with Hybrid Subtitle */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 id="modal-title" className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" aria-hidden="true" />
              {editingQuest ? "Edit Quest Details" : "Create Quest (New Task)"}
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5">
              {editingQuest
                ? "Update your task description or deadline."
                : "Add a new real-world activity to your quest board to earn XP and Gold."}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-md text-foreground-muted hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Tab Selector */}
        {!editingQuest && tab !== "topics" && tab !== "subtopics" && tab !== "details" && (
          <div className="flex border-b border-border mb-4 pt-2">
            <button
              onClick={() => setTab("custom")}
              aria-selected={tab === "custom"}
              className={`pb-2 px-4 text-xs font-semibold transition-colors border-b-2 ${
                tab === "custom" ? "border-gold text-gold" : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              Custom Task
            </button>
            <button
              onClick={() => setTab("templates")}
              aria-selected={tab === "templates"}
              className={`pb-2 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
                tab === "templates" ? "border-gold text-gold" : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              Popular Task
            </button>
          </div>
        )}

        {/* Tab 1: Custom Quest Form */}
        {tab === "custom" ? (
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div>
              <label htmlFor="quest-title" className="block text-xs font-semibold text-foreground mb-1">
                Task Title *
              </label>
              <input
                id="quest-title"
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Read 10 pages of software architecture"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none"
              />
            </div>

            {selectedTemplateSlug && TEMPLATE_TOPICS[selectedTemplateSlug] && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Suggested Topics (Click to select)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TEMPLATE_TOPICS[selectedTemplateSlug].map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        const baseTitle = title.includes(":") ? title.split(":")[0] : title;
                        setTitle(`${baseTitle}: ${topic}`);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-secondary/50 border border-border hover:border-gold hover:text-gold transition-colors text-foreground-muted"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="quest-desc" className="block text-xs font-semibold text-foreground mb-1">
                Notes & Description (Optional)
              </label>
              <textarea
                id="quest-desc"
                rows={2}
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details, focus criteria, or helpful reminder notes..."
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quest-attribute" className="block text-xs font-semibold text-foreground mb-1">
                  Attribute Category
                </label>
                <select
                  id="quest-attribute"
                  value={attribute}
                  onChange={(e) => setAttribute(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none"
                >
                  <option value="STRENGTH">Strength (Physical Fitness & Body)</option>
                  <option value="INTELLECT">Intellect (Learning & Code)</option>
                  <option value="DISCIPLINE">Discipline (Routine & Focus)</option>
                  <option value="VITALITY">Vitality (Recovery & Mindfulness)</option>
                  <option value="CHARISMA">Charisma (Social & Kindness)</option>
                </select>
              </div>

              <div>
                <label htmlFor="quest-difficulty" className="block text-xs font-semibold text-foreground mb-1">
                  Difficulty Level ({DIFFICULTY_XP[difficulty]} Base XP)
                </label>
                <select
                  id="quest-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none"
                >
                  <option value="TRIVIAL">TRIVIAL (10 XP, 6 Gold)</option>
                  <option value="EASY">EASY (25 XP, 15 Gold)</option>
                  <option value="MEDIUM">MEDIUM (50 XP, 30 Gold)</option>
                  <option value="HARD">HARD (90 XP, 54 Gold)</option>
                  <option value="EPIC">EPIC (150 XP, 90 Gold)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quest-cadence" className="block text-xs font-semibold text-foreground mb-1">
                  Repetition Cadence
                </label>
                <select
                  id="quest-cadence"
                  value={cadence}
                  onChange={(e) => setCadence(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none"
                >
                  <option value="DAILY">Daily Habit (Resets each calendar day)</option>
                  <option value="WEEKLY">Weekly Goal (Configurable target per week)</option>
                  <option value="ONCE">One-Time Task (Single completion)</option>
                </select>
              </div>

              {cadence === "WEEKLY" && (
                <div>
                  <label htmlFor="quest-weekly-target" className="block text-xs font-semibold text-foreground mb-1">
                    Weekly Target (Completions per week)
                  </label>
                  <input
                    id="quest-weekly-target"
                    type="number"
                    min={1}
                    max={7}
                    value={weeklyTarget}
                    onChange={(e) => setWeeklyTarget(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none"
                  />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border flex justify-between gap-2">
              {!editingQuest ? (
                <button
                  type="button"
                  onClick={() => setTab("templates")}
                  className="px-3 py-2 rounded-lg border border-transparent text-foreground-muted hover:text-foreground text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  Back
                </button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-border text-foreground-muted hover:text-foreground text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg bg-gold text-page font-bold text-xs hover:bg-gold/90 transition-transform active:scale-95 shadow-glow"
                >
                  {isSubmitting ? "Saving..." : editingQuest ? "Update Quest" : "Save Quest"}
                </button>
              </div>
            </div>
          </form>
        ) : tab === "details" && selectedTemplateSlug && selectedTopic && selectedSubtopic ? (
          /* Tab: Deep Topics Selection */
          <div className="flex flex-col flex-1 overflow-hidden space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <button
                onClick={() => setTab("subtopics")}
                className="p-2 rounded-lg bg-secondary border border-border hover:border-gold hover:text-gold transition-colors text-foreground-muted"
                aria-label="Back to subtopics"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <div>
                <h3 className="text-sm font-bold text-foreground">{selectedSubtopic}</h3>
                <p className="text-xs text-foreground-muted">Line-wise detailed concepts</p>
              </div>
            </div>
            
            <div className="overflow-y-auto pr-1 flex-1">
              <div className="flex flex-col gap-2">
                {DEEP_TOPICS[selectedSubtopic]?.map(detail => (
                  <button
                    key={detail}
                    onClick={() => {
                      const tmpl = INITIAL_TEMPLATES.find(t => t.slug === selectedTemplateSlug);
                      if (tmpl) handleAdoptTemplate(tmpl, `${selectedSubtopic} - ${detail}`);
                    }}
                    className="p-3 text-left rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-gold/60 hover:shadow-[0_0_15px_rgba(255,215,0,0.1)] transition-all text-sm font-medium text-foreground flex items-center justify-between group"
                  >
                    {detail}
                    <PlusCircle className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </button>
                ))}
                <button
                   onClick={() => {
                      const tmpl = INITIAL_TEMPLATES.find(t => t.slug === selectedTemplateSlug);
                      if (tmpl) handleAdoptTemplate(tmpl, `${selectedTopic} - ${selectedSubtopic}`);
                   }}
                   className="p-3 mt-1 text-left rounded-lg border border-border bg-secondary/30 hover:bg-secondary hover:border-border transition-all text-sm font-medium text-foreground-muted italic flex items-center justify-between group"
                >
                  General {selectedSubtopic}
                  <PlusCircle className="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ) : tab === "subtopics" && selectedTemplateSlug && selectedTopic ? (
          /* Tab: Subtopics Selection */
          <div className="flex flex-col flex-1 overflow-hidden space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <button
                onClick={() => setTab("topics")}
                className="p-2 rounded-lg bg-secondary border border-border hover:border-gold hover:text-gold transition-colors text-foreground-muted"
                aria-label="Back to topics"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <div>
                <h3 className="text-sm font-bold text-foreground">{selectedTopic}</h3>
                <p className="text-xs text-foreground-muted">Select a specific subtopic to focus on</p>
              </div>
            </div>
            
            <div className="overflow-y-auto pr-1 flex-1">
              <div className="flex flex-col gap-2">
                {SUBTOPICS[selectedTopic]?.map(subtopic => (
                  <button
                    key={subtopic}
                    onClick={() => {
                      if (DEEP_TOPICS[subtopic]) {
                        setSelectedSubtopic(subtopic);
                        setTab("details");
                      } else {
                        const tmpl = INITIAL_TEMPLATES.find(t => t.slug === selectedTemplateSlug);
                        if (tmpl) handleAdoptTemplate(tmpl, `${selectedTopic} - ${subtopic}`);
                      }
                    }}
                    className="p-3 text-left rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-gold/60 hover:shadow-[0_0_15px_rgba(255,215,0,0.1)] transition-all text-sm font-medium text-foreground flex items-center justify-between group"
                  >
                    {subtopic}
                    <PlusCircle className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </button>
                ))}
                <button
                   onClick={() => {
                      const tmpl = INITIAL_TEMPLATES.find(t => t.slug === selectedTemplateSlug);
                      if (tmpl) handleAdoptTemplate(tmpl, selectedTopic);
                   }}
                   className="p-3 mt-1 text-left rounded-lg border border-border bg-secondary/30 hover:bg-secondary hover:border-border transition-all text-sm font-medium text-foreground-muted italic flex items-center justify-between group"
                >
                  General {selectedTopic}
                  <PlusCircle className="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ) : tab === "topics" && selectedTemplateSlug ? (
          /* Tab: Topics Selection */
          <div className="flex flex-col flex-1 overflow-hidden space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <button
                onClick={() => setTab("templates")}
                className="p-2 rounded-lg bg-secondary border border-border hover:border-gold hover:text-gold transition-colors text-foreground-muted"
                aria-label="Back to templates"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <div>
                <h3 className="text-sm font-bold text-foreground">Select a Topic</h3>
                <p className="text-xs text-foreground-muted">Choose a specific area to focus on for this task</p>
              </div>
            </div>
            
            <div className="overflow-y-auto pr-1 flex-1">
              <div className="flex flex-col gap-2">
                {TEMPLATE_TOPICS[selectedTemplateSlug]?.map(topic => (
                  <button
                    key={topic}
                    onClick={() => {
                      if (SUBTOPICS[topic]) {
                        setSelectedTopic(topic);
                        setTab("subtopics");
                      } else {
                        const tmpl = INITIAL_TEMPLATES.find(t => t.slug === selectedTemplateSlug);
                        if (tmpl) handleAdoptTemplate(tmpl, topic);
                      }
                    }}
                    className="p-3 text-left rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-gold/60 hover:shadow-[0_0_15px_rgba(255,215,0,0.1)] transition-all text-sm font-medium text-foreground flex items-center justify-between group"
                  >
                    {topic}
                    <PlusCircle className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </button>
                ))}
                <button
                   onClick={() => {
                      const tmpl = INITIAL_TEMPLATES.find(t => t.slug === selectedTemplateSlug);
                      if (tmpl) handleAdoptTemplate(tmpl);
                   }}
                   className="p-3 mt-1 text-left rounded-lg border border-border bg-secondary/30 hover:bg-secondary hover:border-border transition-all text-sm font-medium text-foreground-muted italic flex items-center justify-between group"
                >
                  General / Broad Topic
                  <PlusCircle className="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Tab: Template Codex */
          <div className="flex flex-col flex-1 overflow-hidden space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-4 h-4 text-foreground-muted absolute left-3 top-2.5" aria-hidden="true" />
                <input
                  type="text"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="Search 52 habit templates..."
                  aria-label="Search habit templates"
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-gold"
                />
              </div>

              <select
                value={templateAttrFilter}
                onChange={(e) => setTemplateAttrFilter(e.target.value)}
                aria-label="Filter templates by category"
                className="text-xs px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-foreground outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="STRENGTH">Strength</option>
                <option value="INTELLECT">Intellect</option>
                <option value="DISCIPLINE">Discipline</option>
                <option value="VITALITY">Vitality</option>
                <option value="CHARISMA">Charisma</option>
              </select>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {filteredTemplates.map((tmpl) => (
                <div
                  key={tmpl.slug}
                  className="p-3 rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-gold/50 transition-colors flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-panel border border-border text-foreground">
                          {tmpl.attribute}
                        </span>
                        <span className="text-[10px] text-foreground-muted">
                          {tmpl.difficulty} · {tmpl.cadence}
                        </span>
                      </div>
                      <h3 className="text-xs font-semibold text-foreground truncate">{tmpl.title}</h3>
                      <p className="text-[11px] text-foreground-muted line-clamp-1">{tmpl.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (TEMPLATE_TOPICS[tmpl.slug]) {
                          setSelectedTemplateSlug(tmpl.slug);
                          setTab("topics");
                        } else {
                          handleAdoptTemplate(tmpl);
                        }
                      }}
                      aria-label={`Start: ${tmpl.title}`}
                      className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-page transition-colors shrink-0"
                    >
                      <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

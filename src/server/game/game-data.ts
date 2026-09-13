export type GameQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type GameBoss = {
  name: string;
  description: string;
  hp: number;
  questions: GameQuestion[];
};

export const FALLBACK_BOSS: GameBoss = {
  name: "The Unknown Entity",
  description: "A mysterious force of knowledge that challenges your understanding.",
  hp: 200, // 20 questions to defeat (10 HP per question)
  questions: [
    {
      question: "What is the primary goal of mastering this concept?",
      options: [
        "To memorize it without understanding.",
        "To apply it to solve complex problems efficiently.",
        "To never use it again.",
        "To impress others with jargon."
      ],
      correctIndex: 1,
      explanation: "True mastery means you can apply the concept to solve problems efficiently."
    },
    {
      question: "How should you approach a problem you've never seen before?",
      options: [
        "Give up immediately.",
        "Copy the answer from the internet blindly.",
        "Break it down into smaller, manageable pieces.",
        "Guess randomly until it works."
      ],
      correctIndex: 2,
      explanation: "Decomposition (breaking things down) is key to problem solving."
    },
    {
      question: "Why is practice important for this topic?",
      options: [
        "It builds muscle memory and deepens understanding.",
        "It isn't important.",
        "It wastes time.",
        "It only helps with typing speed."
      ],
      correctIndex: 0,
      explanation: "Practice reinforces neural pathways and deepens conceptual understanding."
    },
    {
      question: "When encountering a bug in your code, what is the best first step?",
      options: [
        "Delete all the code and start over.",
        "Read the error message carefully to understand the cause.",
        "Change random lines of code hoping it fixes the issue.",
        "Blame the programming language."
      ],
      correctIndex: 1,
      explanation: "Error messages are clues. Reading them is the fastest way to pinpoint the issue."
    },
    {
      question: "What does 'DRY' stand for in software engineering?",
      options: [
        "Do Read YouTube",
        "Don't Repeat Yourself",
        "Data Recovery Yield",
        "Deploy Regularly Yearly"
      ],
      correctIndex: 1,
      explanation: "DRY is a principle aimed at reducing repetition of software patterns."
    },
    {
      question: "Why is writing clean, readable code so important?",
      options: [
        "Because the compiler requires it.",
        "Because code is read much more often than it is written.",
        "It actually isn't important; only performance matters.",
        "To make the files smaller."
      ],
      correctIndex: 1,
      explanation: "You and your team will spend vastly more time reading existing code than writing new code."
    },
    {
      question: "What is the primary purpose of a version control system like Git?",
      options: [
        "To make your code run faster.",
        "To write the code for you.",
        "To track changes over time and collaborate safely.",
        "To compile your code."
      ],
      correctIndex: 2,
      explanation: "Git allows you to track history, revert mistakes, and collaborate with others without overwriting their work."
    },
    {
      question: "What is 'Rubber Duck Debugging'?",
      options: [
        "A specialized software tool for debugging.",
        "Explaining your code line-by-line to an inanimate object to spot logical errors.",
        "Throwing a rubber duck at your computer in frustration.",
        "Writing tests before writing code."
      ],
      correctIndex: 1,
      explanation: "The process of explaining a problem out loud often forces you to see it from a new perspective and spot the flaw."
    },
    {
      question: "Why are unit tests valuable?",
      options: [
        "They automatically fix bugs.",
        "They verify that individual, small pieces of code work correctly in isolation.",
        "They replace the need for QA testers entirely.",
        "They make the codebase look more professional without adding real value."
      ],
      correctIndex: 1,
      explanation: "Unit tests ensure that functions do exactly what they are supposed to do, catching regressions early."
    },
    {
      question: "What does Time Complexity (Big O notation) describe?",
      options: [
        "Exactly how many seconds a program will take to run.",
        "How much memory the program uses.",
        "How the runtime of an algorithm grows as the input size grows.",
        "How difficult the code is to read."
      ],
      correctIndex: 2,
      explanation: "Big O gives you a high-level understanding of algorithmic scalability, regardless of hardware."
    },
    {
      question: "What is a major difference between a compiler and an interpreter?",
      options: [
        "An interpreter is always faster.",
        "A compiler translates all code before running, while an interpreter translates and executes line-by-line.",
        "A compiler only works for web development.",
        "There is no difference."
      ],
      correctIndex: 1,
      explanation: "Compilers produce an executable file ahead of time. Interpreters read and execute the source code on the fly."
    },
    {
      question: "Why should you avoid 'magic numbers' in your code?",
      options: [
        "Because numbers shouldn't be used in programming.",
        "Because unexplained numbers make the code harder to understand and maintain.",
        "Because they cause memory leaks.",
        "Because computers prefer strings."
      ],
      correctIndex: 1,
      explanation: "Assigning a number to a well-named constant clarifies its purpose and makes future updates easier."
    },
    {
      question: "What does 'Refactoring' mean?",
      options: [
        "Adding new features to an existing application.",
        "Restructuring existing code to improve it without changing its external behavior.",
        "Deleting old code.",
        "Writing documentation."
      ],
      correctIndex: 1,
      explanation: "Refactoring improves readability, reduces complexity, and makes the code easier to maintain, while keeping the same outputs."
    },
    {
      question: "How can you best prevent burnout when learning complex topics?",
      options: [
        "Study for 16 hours a day straight.",
        "Never take a day off.",
        "Take regular breaks, pace yourself, and celebrate small wins.",
        "Drink excessive amounts of caffeine."
      ],
      correctIndex: 2,
      explanation: "Learning is a marathon, not a sprint. Your brain needs time to rest and consolidate new information."
    },
    {
      question: "What does the term 'Technical Debt' refer to?",
      options: [
        "The money a company owes for servers.",
        "The implied cost of future reworking caused by choosing an easy, messy solution now.",
        "The cost of software licenses.",
        "A new cryptocurrency."
      ],
      correctIndex: 1,
      explanation: "Taking shortcuts now gets the feature out faster, but creates 'debt' that must be paid back later through refactoring."
    },
    {
      question: "Why is it important to name your variables descriptively?",
      options: [
        "To make the code compile faster.",
        "So that others (and future you) can easily understand what the data represents.",
        "To show off your vocabulary.",
        "It isn't important; 'x' and 'y' are always fine."
      ],
      correctIndex: 1,
      explanation: "Good variable names are like self-documenting code; they tell the reader exactly what the program is doing."
    },
    {
      question: "What is the 'Single Responsibility Principle'?",
      options: [
        "A developer should only work on one project at a time.",
        "A function, class, or module should have only one reason to change (do one thing).",
        "A program should only have one file.",
        "A team should only have one manager."
      ],
      correctIndex: 1,
      explanation: "Keeping functions focused on a single task makes them easier to test, debug, and reuse."
    },
    {
      question: "When asking for programming help on a forum (like StackOverflow), what is crucial to include?",
      options: [
        "A minimal, reproducible example of your problem.",
        "Your entire 10,000 line codebase.",
        "Just the error message with no code.",
        "A vague description of what isn't working."
      ],
      correctIndex: 0,
      explanation: "A minimal reproducible example allows others to quickly run your code and see the exact issue you're facing."
    },
    {
      question: "What is 'Pseudocode'?",
      options: [
        "Code that has syntax errors.",
        "A plain language description of the steps in an algorithm, not tied to a specific language.",
        "A secure way to encrypt code.",
        "Code written by AI."
      ],
      correctIndex: 1,
      explanation: "Pseudocode helps you plan the logic of your algorithm before worrying about the exact syntax of Python, JS, C++, etc."
    },
    {
      question: "True mastery of a concept is often achieved when you can:",
      options: [
        "Copy-paste the code from a tutorial without looking.",
        "Explain it simply to someone else who doesn't know it.",
        "Write the code as fast as possible.",
        "Use the most complex terminology possible."
      ],
      correctIndex: 1,
      explanation: "The Feynman Technique states that if you can't explain it simply, you don't understand it well enough."
    }
  ]
};

export const TOPIC_GAMES: Record<string, GameBoss> = {
  "Two Pointers Technique": {
    name: "The Pointer Wraith",
    description: "A dual-headed spectre that manipulates two ends of reality simultaneously.",
    hp: 200, // 20 questions to defeat (10 HP per question)
    questions: [
      {
        question: "What is the main advantage of the Two Pointers technique?",
        options: [
          "It uses more memory but is faster.",
          "It reduces time complexity (often from O(N^2) to O(N)) by avoiding nested loops.",
          "It only works on linked lists.",
          "It is a built-in function in most languages."
        ],
        correctIndex: 1,
        explanation: "Two Pointers can reduce a nested O(N^2) loop into a single O(N) traversal."
      },
      {
        question: "When is the 'Left and Right' two pointer approach most commonly used?",
        options: [
          "On unsorted arrays to find the maximum element.",
          "On sorted arrays to find pairs (like Two Sum) or reverse an array.",
          "To traverse a binary tree.",
          "To sort a linked list."
        ],
        correctIndex: 1,
        explanation: "Sorted arrays allow you to systematically move the left or right pointer based on the sum."
      },
      {
        question: "What is the 'Fast and Slow' pointer approach (Floyd's Tortoise and Hare) primarily used for?",
        options: [
          "Detecting cycles in a Linked List.",
          "Reversing a string.",
          "Finding the shortest path in a graph.",
          "Sorting an array."
        ],
        correctIndex: 0,
        explanation: "Fast moves by 2 steps, Slow moves by 1. If there's a cycle, they will eventually meet."
      },
      {
        question: "In a sorted array, if the sum of elements at the left and right pointers is GREATER than the target, what should you do?",
        options: [
          "Move the left pointer to the right.",
          "Move the right pointer to the left.",
          "Move both pointers.",
          "Stop the loop."
        ],
        correctIndex: 1,
        explanation: "Because the array is sorted, moving the right pointer to the left will decrease the total sum."
      },
      {
        question: "If the sum of the elements at the left and right pointers is LESS than the target?",
        options: [
          "Move the left pointer to the right.",
          "Move the right pointer to the left.",
          "Move both pointers.",
          "Reset the pointers."
        ],
        correctIndex: 0,
        explanation: "Moving the left pointer to the right will increase the total sum, bringing it closer to the target."
      },
      {
        question: "What is the typical space complexity of a Two Pointers algorithm?",
        options: [
          "O(N)",
          "O(log N)",
          "O(N^2)",
          "O(1)"
        ],
        correctIndex: 3,
        explanation: "Two pointers usually only require storing a few integer variables (indices), resulting in O(1) auxiliary space."
      },
      {
        question: "Can Two Pointers be used to find a triplet that sums to zero (3Sum)?",
        options: [
          "No, it only works for pairs.",
          "Yes, by fixing one element and using two pointers for the remaining two.",
          "Yes, but you need three pointers moving at the same time from the edges.",
          "Only if the array is entirely positive numbers."
        ],
        correctIndex: 1,
        explanation: "By iterating through the array and fixing the current element, you can use left and right pointers on the rest of the array to find the other two elements."
      },
      {
        question: "When reversing an array in-place, what do you do with the left and right pointers?",
        options: [
          "Swap their elements, then move both pointers towards the center.",
          "Add their elements together.",
          "Only move the left pointer until it reaches the right.",
          "Create a new array and copy elements."
        ],
        correctIndex: 0,
        explanation: "You swap array[left] and array[right], then increment left and decrement right until they meet."
      },
      {
        question: "When checking if a string is a palindrome using two pointers, where do they start?",
        options: [
          "Both at the beginning.",
          "Both at the end.",
          "One at the beginning, one at the end.",
          "In the middle and move outwards."
        ],
        correctIndex: 2,
        explanation: "You start at the ends and compare characters, moving inwards until a mismatch is found or they meet."
      },
      {
        question: "In a linked list, how do you find the exact middle element in a single pass?",
        options: [
          "Count all elements, divide by two, then traverse again.",
          "Use a fast pointer (moves 2 steps) and a slow pointer (moves 1 step). When fast reaches the end, slow is in the middle.",
          "You cannot do this in one pass.",
          "Start one pointer at head and one at tail."
        ],
        correctIndex: 1,
        explanation: "Since the fast pointer travels twice as fast, when it hits the end, the slow pointer will be exactly halfway through."
      },
      {
        question: "What is the standard while loop condition for a left/right pointer algorithm on an array?",
        options: [
          "while (left != right)",
          "while (left < right)",
          "while (left > right)",
          "while (left <= right)"
        ],
        correctIndex: 1,
        explanation: "You typically want to process pairs until the pointers meet, so 'left < right' prevents them from crossing or processing the same element twice."
      },
      {
        question: "How do you find the k-th node from the end of a linked list using two pointers?",
        options: [
          "Move one pointer k steps ahead, then move both at the same speed until the first reaches the end.",
          "Start one at the head and one at the tail.",
          "Move the slow pointer k steps, then fast pointer 2k steps.",
          "It's impossible without knowing the length first."
        ],
        correctIndex: 0,
        explanation: "Maintaining a gap of 'k' between the two pointers means when the front pointer hits the end, the back pointer is exactly at the k-th node from the end."
      },
      {
        question: "If you need to find the intersection of two SORTED arrays, how do you move the pointers?",
        options: [
          "Move both pointers at the same time always.",
          "Move the pointer that is pointing to the SMALLER element.",
          "Move the pointer that is pointing to the LARGER element.",
          "Move the pointer of the longer array."
        ],
        correctIndex: 1,
        explanation: "By moving the pointer of the smaller element, you give it a chance to catch up and match the larger element in the other array."
      },
      {
        question: "Why is the array usually required to be sorted for the left/right pointer technique to work for sum problems?",
        options: [
          "Because sorting makes the array shorter.",
          "Because it provides a monotonic property where moving pointers guarantees the sum will increase or decrease predictably.",
          "Because two pointers can't be used on random memory.",
          "It's not required; it's just a coincidence."
        ],
        correctIndex: 1,
        explanation: "If the array isn't sorted, moving a pointer left or right has an unpredictable effect on the sum."
      },
      {
        question: "What happens if you use the left/right two pointer approach on an UNSORTED array for the Two Sum problem?",
        options: [
          "It works perfectly in O(N) time.",
          "It will fail to reliably find the correct pairs because moving pointers won't predictably change the sum.",
          "It will throw an out of bounds exception.",
          "It becomes O(log N) time."
        ],
        correctIndex: 1,
        explanation: "Without the sorted property, you can't logically decide whether to move the left or right pointer when the sum doesn't match."
      },
      {
        question: "In the 'Container With Most Water' problem, you start with pointers at both ends. Which pointer do you move?",
        options: [
          "The one pointing to the taller line.",
          "The one pointing to the shorter line.",
          "The left one always.",
          "The right one always."
        ],
        correctIndex: 1,
        explanation: "The volume is limited by the shorter line. Moving the taller line cannot possibly increase the area, so you must move the shorter one to seek a taller bound."
      },
      {
        question: "When removing duplicates from a sorted array in-place, what does the slow pointer typically represent?",
        options: [
          "The end of the array.",
          "The position where the next unique element should be written.",
          "The number of duplicates found.",
          "The current element being checked."
        ],
        correctIndex: 1,
        explanation: "The fast pointer scans ahead for new unique elements, and copies them to the slow pointer's position."
      },
      {
        question: "In the 'Dutch National Flag' problem (sorting an array of 0s, 1s, and 2s in-place), how many pointers are used?",
        options: [
          "One pointer.",
          "Two pointers.",
          "Three pointers (low, mid, high).",
          "Four pointers."
        ],
        correctIndex: 2,
        explanation: "You use a 'low' pointer for 0s, a 'high' pointer for 2s, and a 'mid' pointer to scan through the array."
      },
      {
        question: "What is a very common pitfall or bug when implementing Two Pointers?",
        options: [
          "Using too much RAM.",
          "Stack overflow errors.",
          "Off-by-one errors and Out-of-Bounds exceptions.",
          "Memory leaks."
        ],
        correctIndex: 2,
        explanation: "It's very easy to accidentally move a pointer past the end of the array or cross them when you shouldn't, causing out-of-bounds errors."
      },
      {
        question: "In cycle detection (Floyd's algorithm), what does it mean if the fast and slow pointers eventually point to the exact same node?",
        options: [
          "The linked list is perfectly sorted.",
          "You have reached the end of the list.",
          "There is a cycle (a loop) in the linked list.",
          "The linked list has an odd number of elements."
        ],
        correctIndex: 2,
        explanation: "The fast pointer 'lapped' the slow pointer, which is only possible if they are running in a circle (cycle)."
      }
    ]
  },
  "Basic Array Operations (Insert, Delete, Traverse)": {
    name: "The Array Golem",
    description: "A rigid, contiguous beast made of sequential memory blocks.",
    hp: 200,
    questions: [
      {
        question: "What is the time complexity of accessing an element in an array by its index?",
        options: [
          "O(N)",
          "O(log N)",
          "O(1)",
          "O(N^2)"
        ],
        correctIndex: 2,
        explanation: "Arrays are stored in contiguous memory, allowing O(1) direct access via index."
      },
      {
        question: "Why is inserting an element at the BEGINNING of a standard array slow?",
        options: [
          "Because you have to allocate new memory every time.",
          "Because you have to shift all existing elements one position to the right (O(N)).",
          "Because arrays only allow insertion at the end.",
          "It is actually very fast (O(1))."
        ],
        correctIndex: 1,
        explanation: "To make room at the beginning, every other element must be shifted right, taking O(N) time."
      },
      {
        question: "Which of the following best describes an array's memory layout?",
        options: [
          "Nodes scattered randomly in memory connected by pointers.",
          "A contiguous block of memory cells.",
          "A tree-like structure.",
          "A Last-In-First-Out structure."
        ],
        correctIndex: 1,
        explanation: "Arrays allocate a single, continuous block of memory, which makes caching and indexing very fast."
      },
      {
        question: "What typically happens under the hood when a dynamic array (like Python list or C++ vector) reaches its maximum capacity?",
        options: [
          "It crashes.",
          "It allocates a new, larger block of memory (usually double the size) and copies all elements over.",
          "It starts deleting the oldest elements.",
          "It converts itself into a linked list."
        ],
        correctIndex: 1,
        explanation: "Dynamic arrays resize themselves automatically by creating a bigger array and copying the old elements (O(N) operation)."
      },
      {
        question: "Deleting an element from the very END of a dynamic array is typically:",
        options: [
          "O(N) time.",
          "O(log N) time.",
          "O(1) time.",
          "Impossible."
        ],
        correctIndex: 2,
        explanation: "Because you don't need to shift any elements, you simply reduce the size counter by 1, which takes O(1) time."
      },
      {
        question: "Why is iterating over an array generally faster than iterating over a linked list?",
        options: [
          "Arrays have fewer elements.",
          "Because of spatial locality and CPU caching; contiguous memory is loaded into the cache much faster.",
          "Linked lists use more complex variables.",
          "It isn't faster; linked lists are always faster."
        ],
        correctIndex: 1,
        explanation: "Modern CPUs load memory in chunks (cache lines). An array's contiguous layout perfectly utilizes this."
      },
      {
        question: "What is a 2D array?",
        options: [
          "An array that can hold only two elements.",
          "An array where each element is itself an array, representing a grid or matrix.",
          "An array stored on a 2D hard drive.",
          "A pair of linked lists."
        ],
        correctIndex: 1,
        explanation: "A 2D array is an array of arrays, useful for representing matrices, grids, or tables."
      },
      {
        question: "In languages like C/C++, what does the array variable itself actually point to?",
        options: [
          "The middle element of the array.",
          "The size of the array.",
          "The memory address of the first element.",
          "A hash map of the array contents."
        ],
        correctIndex: 2,
        explanation: "An array variable is basically a pointer to the 0th element's memory address."
      },
      {
        question: "What is a common way to traverse all elements of a 2D matrix?",
        options: [
          "Using a single while loop.",
          "Using nested for loops (one for rows, one for columns).",
          "Using a binary search.",
          "Using a hash map."
        ],
        correctIndex: 1,
        explanation: "You iterate through each row, and within that row, you iterate through each column."
      },
      {
        question: "What is the exact index of the LAST element in an array of size N?",
        options: [
          "N",
          "N + 1",
          "N - 1",
          "0"
        ],
        correctIndex: 2,
        explanation: "Because array indices start at 0 (zero-indexed), the last element is always at index N - 1."
      },
      {
        question: "What does an 'in-place' array algorithm mean?",
        options: [
          "It only works in a specific folder.",
          "It requires creating a duplicate array in memory.",
          "It modifies the original array directly without requiring significant extra memory (O(1) space).",
          "It cannot be moved to another server."
        ],
        correctIndex: 2,
        explanation: "In-place means you manipulate the input directly, saving memory."
      },
      {
        question: "Which sorting algorithm often performs poorly (O(N^2)) on an array but is simple to implement by repeatedly swapping adjacent elements?",
        options: [
          "Merge Sort",
          "Quick Sort",
          "Bubble Sort",
          "Heap Sort"
        ],
        correctIndex: 2,
        explanation: "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order."
      },
      {
        question: "How do you find the minimum element in an UNSORTED array?",
        options: [
          "Look at the first element.",
          "Look at the last element.",
          "Iterate through every element keeping track of the smallest found so far.",
          "Use a hash map."
        ],
        correctIndex: 2,
        explanation: "Since the array is unsorted, the minimum could be anywhere, so you must check every element (O(N) time)."
      },
      {
        question: "What is the time complexity to search for a specific value in an UNSORTED array?",
        options: [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N^2)"
        ],
        correctIndex: 2,
        explanation: "You have to check every element one by one (Linear Search) because there is no predictable order."
      },
      {
        question: "What is the time complexity to search for a specific value in a SORTED array using Binary Search?",
        options: [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N log N)"
        ],
        correctIndex: 1,
        explanation: "Binary Search halves the search space at every step, making it extremely fast (O(log N))."
      },
      {
        question: "What is an 'out of bounds' exception (IndexOutOfBounds)?",
        options: [
          "When the array is too small for the data.",
          "Attempting to access an index that is less than 0 or greater than/equal to the array size.",
          "When the array is full.",
          "When the array contains invalid characters."
        ],
        correctIndex: 1,
        explanation: "You cannot access memory outside the bounds of the array. If size is 5, accessing index 5 or -1 causes this error."
      },
      {
        question: "Why might you use an array INSTEAD of a hash map / dictionary?",
        options: [
          "When you want slower lookup times.",
          "When the order of elements matters and keys are sequential integers starting from 0.",
          "When you need to store key-value pairs with string keys.",
          "Arrays are always worse than hash maps."
        ],
        correctIndex: 1,
        explanation: "Arrays maintain a strict sequence and are highly optimized for integer index lookups."
      },
      {
        question: "How do you swap two elements in an array at indices 'i' and 'j'?",
        options: [
          "arr[i] = arr[j]; arr[j] = arr[i];",
          "Use a temporary variable: temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;",
          "You cannot swap elements in an array.",
          "arr[i, j] = arr[j, i];"
        ],
        correctIndex: 1,
        explanation: "You must use a temporary variable so the first value isn't overwritten and lost."
      },
      {
        question: "What is a 'sparse' array?",
        options: [
          "An array that is very short.",
          "An array that uses little memory.",
          "An array where most of the elements have a default value (usually zero or null).",
          "An array of strings."
        ],
        correctIndex: 2,
        explanation: "In a sparse array, only a few elements have meaningful values, so alternative data structures (like Hash Maps) are often used to save memory."
      },
      {
        question: "If you have two nested loops iterating over an array of size N, what is the typical time complexity?",
        options: [
          "O(N)",
          "O(log N)",
          "O(N^2)",
          "O(1)"
        ],
        correctIndex: 2,
        explanation: "For every element in the outer loop, the inner loop runs N times, resulting in N * N = O(N^2) operations."
      }
    ]
  },
  "Sliding Window Algorithm": {
    name: "The Window Ooze",
    description: "A shapeshifting anomaly that expands and contracts across data streams.",
    hp: 200,
    questions: [
      {
        question: "Which type of problem is the Sliding Window technique best suited for?",
        options: [
          "Finding the shortest path in a maze.",
          "Finding a subarray or substring that satisfies a certain condition.",
          "Sorting a list of numbers.",
          "Traversing a binary search tree."
        ],
        correctIndex: 1,
        explanation: "Sliding Window is perfect for contiguous sequence problems (subarrays/substrings)."
      },
      {
        question: "In a dynamic sliding window, when do you usually shrink the window (move the left pointer)?",
        options: [
          "When the window becomes invalid according to the problem constraints.",
          "At every step of the loop.",
          "Only at the very end of the array.",
          "You never shrink it, you only grow it."
        ],
        correctIndex: 0,
        explanation: "You expand the right pointer to find a valid window, and shrink the left pointer to optimize it or make it valid again."
      },
      {
        question: "What is the typical time complexity of an optimized Sliding Window algorithm?",
        options: [
          "O(N^2)",
          "O(N log N)",
          "O(N)",
          "O(1)"
        ],
        correctIndex: 2,
        explanation: "Even with a nested while loop for shrinking, the left and right pointers each traverse the array at most once, resulting in O(N)."
      },
      {
        question: "What is the main difference between a fixed-size and a variable-size sliding window?",
        options: [
          "Fixed-size always uses arrays; variable uses linked lists.",
          "Fixed-size remains a constant length K, while variable expands/contracts based on a condition.",
          "Variable-size requires O(N^2) time.",
          "There is no difference."
        ],
        correctIndex: 1,
        explanation: "Fixed-size windows slide uniformly. Variable-size windows stretch and shrink based on the data they contain."
      },
      {
        question: "For a fixed-size window of size K, how do you compute the sum of the NEXT window efficiently?",
        options: [
          "Recalculate the sum of all K elements from scratch.",
          "Add the next incoming element and subtract the element that just fell out of the window.",
          "Multiply the current sum by K.",
          "Use a binary search tree."
        ],
        correctIndex: 1,
        explanation: "This avoids recalculating overlapping elements, changing an O(K) operation into an O(1) operation."
      },
      {
        question: "What data structure is often used alongside a sliding window to keep track of character frequencies in a substring problem?",
        options: [
          "A Stack.",
          "A Hash Map or Frequency Array.",
          "A Linked List.",
          "A Heap."
        ],
        correctIndex: 1,
        explanation: "A Hash Map easily keeps counts of characters inside the current window, allowing you to check conditions (like 'no duplicates') in O(1) time."
      },
      {
        question: "Can the variable-size sliding window algorithm easily handle negative numbers when looking for a target sum?",
        options: [
          "Yes, they make it easier.",
          "No, negative numbers break the monotonicity, making it impossible to know if you should shrink or expand.",
          "Yes, but you must sort the array first.",
          "Only if the target sum is also negative."
        ],
        correctIndex: 1,
        explanation: "If numbers can be negative, expanding the window might decrease the sum, and shrinking might increase it. You lose the predictable rule needed for a standard sliding window."
      },
      {
        question: "When finding the 'Longest Substring Without Repeating Characters', what condition causes the left pointer to move?",
        options: [
          "When a duplicate character is found inside the current window.",
          "When a space character is found.",
          "When the string ends.",
          "When the right pointer reaches index 5."
        ],
        correctIndex: 0,
        explanation: "You must shrink the window from the left until the duplicate character is removed from the window."
      },
      {
        question: "What is the space complexity of a sliding window algorithm that only uses two integer pointers to track a maximum sum?",
        options: [
          "O(N)",
          "O(log N)",
          "O(1)",
          "O(N^2)"
        ],
        correctIndex: 2,
        explanation: "Storing just a few pointers and a sum variable takes a constant amount of extra memory."
      },
      {
        question: "In a variable-size window, what does the right pointer typically do in the main loop?",
        options: [
          "It stays stationary.",
          "It continuously expands the window by moving right to explore new elements.",
          "It moves to the left.",
          "It jumps randomly."
        ],
        correctIndex: 1,
        explanation: "The right pointer is the explorer. It brings new elements into the window at every step."
      },
      {
        question: "What happens if the requested fixed window size K is greater than the array's total length?",
        options: [
          "The algorithm crashes immediately.",
          "It should be handled as an edge case, often returning null or the sum of the entire array.",
          "The array automatically expands with zeros.",
          "The window size K is ignored."
        ],
        correctIndex: 1,
        explanation: "You cannot form a window of size K if there aren't K elements. You must write an initial check for this."
      },
      {
        question: "Sliding window is famous for reducing nested loops. Which specific nested loop structure does it replace?",
        options: [
          "Nested loops iterating over completely different arrays.",
          "A nested loop where the inner loop recalculates overlapping sub-ranges from scratch.",
          "A nested loop used for a 2D matrix traversal.",
          "A loop iterating backwards."
        ],
        correctIndex: 1,
        explanation: "It reuses the overlapping work from the previous subarray instead of recalculating it in an inner loop."
      },
      {
        question: "If you need to find the 'Maximum average subarray of size K', what is the very first step of the algorithm?",
        options: [
          "Sort the array in descending order.",
          "Calculate the sum of the very first K elements to create the initial window.",
          "Start pointers at both ends of the array.",
          "Divide every element by K."
        ],
        correctIndex: 1,
        explanation: "You must establish the first window of size K before you can slide it."
      },
      {
        question: "How many times does an optimized sliding window algorithm typically process each element in the array?",
        options: [
          "Exactly once.",
          "At most twice: once when it enters the window, and once when it leaves.",
          "N times.",
          "K times."
        ],
        correctIndex: 1,
        explanation: "The right pointer adds it (first time) and the left pointer removes it (second time). Thus, 2N operations = O(N) time."
      },
      {
        question: "What type of problems CANNOT be solved with a standard sliding window?",
        options: [
          "Problems involving strings.",
          "Problems involving finding subsets or combinations that are NOT contiguous.",
          "Problems involving integers.",
          "Problems looking for a maximum value."
        ],
        correctIndex: 1,
        explanation: "Sliding window strictly requires a contiguous sequence (subarray or substring). It cannot pick and choose non-adjacent elements."
      },
      {
        question: "In the 'Minimum Window Substring' problem, when do you try to SHRINK the window?",
        options: [
          "When the current window contains ALL the required characters (it is valid).",
          "When the current window is missing characters.",
          "When you reach the end of the string.",
          "You never shrink it."
        ],
        correctIndex: 0,
        explanation: "Once you have a valid window, you move the left pointer to make it as small as possible while still keeping it valid."
      },
      {
        question: "What is a 'monotonic queue' and how does it relate to advanced sliding windows?",
        options: [
          "A queue that only accepts prime numbers.",
          "A data structure used to keep track of the maximum or minimum element in a sliding window in O(1) time.",
          "A queue that automatically sorts the entire array.",
          "A linked list with no pointers."
        ],
        correctIndex: 1,
        explanation: "A monotonic queue maintains elements in strictly increasing or decreasing order, allowing you to instantly find the window's max/min."
      },
      {
        question: "Why does sliding window perform so much better than brute force for subarray problems?",
        options: [
          "Because it uses multi-threading.",
          "Because it reuses the overlapping work from the previous subarray instead of recalculating from scratch.",
          "Because it skips half the array.",
          "Because it requires less code."
        ],
        correctIndex: 1,
        explanation: "Caching the previous state and making a tiny adjustment is much faster than recalculating."
      },
      {
        question: "What is a very common bug when implementing a variable-size sliding window?",
        options: [
          "Forgetting to import the sliding window library.",
          "Incorrectly updating the left pointer in a while loop, or failing to update the max/min result before shrinking.",
          "Using a for loop instead of a while loop.",
          "Naming the pointers incorrectly."
        ],
        correctIndex: 1,
        explanation: "Off-by-one errors and updating the result at the wrong step (e.g. after the window becomes invalid) are the most frequent bugs."
      },
      {
        question: "Can sliding window logic be used on a Linked List?",
        options: [
          "No, it only works on Arrays.",
          "Yes, you can maintain two pointers separated by a fixed distance or a specific condition.",
          "No, because linked lists aren't contiguous in memory.",
          "Only if the linked list is doubly linked."
        ],
        correctIndex: 1,
        explanation: "You can easily use two pointers (left and right) on a linked list, advancing them through the nodes to form a 'window'."
      }
    ]
  }
};

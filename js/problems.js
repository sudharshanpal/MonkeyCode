// Problems Database - Sample LeetCode-style problems for CodeType
// Organized by NeetCode 150 topics
class ProblemsDatabase {
    constructor() {
        this.problems = {
            python: {
                'array': [
                    {
                        id: 'two-sum',
                        title: 'Two Sum',
                        topic: 'array',
                        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`,
                        solution: `def twoSum(nums, target):
    hash_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i
    return []`,
                        patterns: ['hash_table', 'array']
                    },
                    {
                        id: 'best-time-to-buy-sell-stock',
                        title: 'Best Time to Buy and Sell Stock',
                        topic: 'array',
                        description: `You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve.`,
                        solution: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    
    return max_profit`,
                        patterns: ['array', 'greedy']
                    }
                ],
                'string': [
                    {
                        id: 'valid-anagram',
                        title: 'Valid Anagram',
                        topic: 'string',
                        description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.`,
                        solution: `def isAnagram(s, t):
    if len(s) != len(t):
        return False
    
    char_count = {}
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1
    
    for char in t:
        if char not in char_count:
            return False
        char_count[char] -= 1
        if char_count[char] == 0:
            del char_count[char]
    
    return len(char_count) == 0`,
                        patterns: ['hash_table', 'string']
                    },
                    {
                        id: 'valid-palindrome',
                        title: 'Valid Palindrome',
                        topic: 'string',
                        description: `Given a string s, return true if it is a palindrome, or false otherwise.`,
                        solution: `def isPalindrome(s):
    cleaned = ''.join(char.lower() for char in s if char.isalnum())
    return cleaned == cleaned[::-1]`,
                        patterns: ['two_pointer', 'string']
                    }
                ],
                'linked-list': [
                    {
                        id: 'reverse-linked-list',
                        title: 'Reverse Linked List',
                        topic: 'linked-list',
                        description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
                        solution: `def reverseList(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev`,
                        patterns: ['linked_list', 'iterative']
                    },
                    {
                        id: 'merge-two-sorted-lists',
                        title: 'Merge Two Sorted Lists',
                        topic: 'linked-list',
                        description: `You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a sorted list.`,
                        solution: `def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    current = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    current.next = list1 or list2
    return dummy.next`,
                        patterns: ['linked_list', 'merge']
                    }
                ],
                'stack': [
                    {
                        id: 'valid-parentheses',
                        title: 'Valid Parentheses',
                        topic: 'stack',
                        description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.`,
                        solution: `def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return len(stack) == 0`,
                        patterns: ['stack', 'string_matching']
                    },
                    {
                        id: 'min-stack',
                        title: 'Min Stack',
                        topic: 'stack',
                        description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.`,
                        solution: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self):
        if self.stack.pop() == self.min_stack[-1]:
            self.min_stack.pop()
    
    def top(self):
        return self.stack[-1]
    
    def getMin(self):
        return self.min_stack[-1]`,
                        patterns: ['stack', 'design']
                    }
                ],
                'binary-tree': [
                    {
                        id: 'invert-binary-tree',
                        title: 'Invert Binary Tree',
                        topic: 'binary-tree',
                        description: `Given the root of a binary tree, invert the tree, and return its root.`,
                        solution: `def invertTree(root):
    if not root:
        return None
    
    root.left, root.right = root.right, root.left
    invertTree(root.left)
    invertTree(root.right)
    
    return root`,
                        patterns: ['binary_tree', 'recursion']
                    },
                    {
                        id: 'maximum-depth-binary-tree',
                        title: 'Maximum Depth of Binary Tree',
                        topic: 'binary-tree',
                        description: `Given the root of a binary tree, return its maximum depth.`,
                        solution: `def maxDepth(root):
    if not root:
        return 0
    
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
                        patterns: ['binary_tree', 'recursion', 'dfs']
                    }
                ],
                'dynamic-programming': [
                    {
                        id: 'climbing-stairs',
                        title: 'Climbing Stairs',
                        topic: 'dynamic-programming',
                        description: `You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps.`,
                        solution: `def climbStairs(n):
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    
    return prev1`,
                        patterns: ['dynamic_programming', 'fibonacci']
                    },
                    {
                        id: 'house-robber',
                        title: 'House Robber',
                        topic: 'dynamic-programming',
                        description: `You are a professional robber planning to rob houses along a street. You cannot rob two adjacent houses.`,
                        solution: `def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2, prev1 = nums[0], max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2, prev1 = prev1, current
    
    return prev1`,
                        patterns: ['dynamic_programming', 'array']
                    }
                ],
                'graph': [
                    {
                        id: 'number-of-islands',
                        title: 'Number of Islands',
                        topic: 'graph',
                        description: `Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.`,
                        solution: `def numIslands(grid):
    if not grid:
        return 0
    
    def dfs(i, j):
        if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] != '1':
            return
        grid[i][j] = '0'
        dfs(i+1, j)
        dfs(i-1, j)
        dfs(i, j+1)
        dfs(i, j-1)
    
    count = 0
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1':
                dfs(i, j)
                count += 1
    
    return count`,
                        patterns: ['graph', 'dfs', 'matrix']
                    },
                    {
                        id: 'clone-graph',
                        title: 'Clone Graph',
                        topic: 'graph',
                        description: `Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.`,
                        solution: `def cloneGraph(node):
    if not node:
        return None
    
    visited = {}
    
    def dfs(node):
        if node in visited:
            return visited[node]
        
        clone = Node(node.val)
        visited[node] = clone
        
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)`,
                        patterns: ['graph', 'dfs', 'hash_table']
                    }
                ],
                'backtracking': [
                    {
                        id: 'generate-parentheses',
                        title: 'Generate Parentheses',
                        topic: 'backtracking',
                        description: `Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.`,
                        solution: `def generateParenthesis(n):
    result = []
    
    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result`,
                        patterns: ['backtracking', 'recursion']
                    },
                    {
                        id: 'permutations',
                        title: 'Permutations',
                        topic: 'backtracking',
                        description: `Given an array nums of distinct integers, return all the possible permutations.`,
                        solution: `def permute(nums):
    result = []
    
    def backtrack(current):
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        for num in nums:
            if num not in current:
                current.append(num)
                backtrack(current)
                current.pop()
    
    backtrack([])
    return result`,
                        patterns: ['backtracking', 'recursion', 'array']
                    }
                ]
            },
            
            javascript: {
                'array': [
                    {
                        id: 'two-sum',
                        title: 'Two Sum',
                        topic: 'array',
                        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`,
                        solution: `function twoSum(nums, target) {
    const hashMap = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (hashMap.has(complement)) {
            return [hashMap.get(complement), i];
        }
        hashMap.set(nums[i], i);
    }
    
    return [];
}`,
                        patterns: ['hash_table', 'array']
                    }
                ],
                'string': [
                    {
                        id: 'valid-anagram',
                        title: 'Valid Anagram',
                        topic: 'string',
                        description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.`,
                        solution: `function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    
    const charCount = {};
    for (let char of s) {
        charCount[char] = (charCount[char] || 0) + 1;
    }
    
    for (let char of t) {
        if (!charCount[char]) return false;
        charCount[char]--;
    }
    
    return true;
}`,
                        patterns: ['hash_table', 'string']
                    }
                ]
            }
        };
        
        // Micro typing drills - common code patterns
        this.microDrills = {
            python: [
                {
                    id: 'for-loop-range',
                    title: 'For Loop with Range',
                    pattern: `for i in range(len(arr)):`,
                    description: 'Common iteration pattern'
                },
                {
                    id: 'list-comprehension',
                    title: 'List Comprehension',
                    pattern: `result = [x * 2 for x in nums if x > 0]`,
                    description: 'Pythonic list creation'
                },
                {
                    id: 'dictionary-get',
                    title: 'Dictionary Operations',
                    pattern: `if key in hash_map:
    return hash_map[key]`,
                    description: 'Safe dictionary access'
                },
                {
                    id: 'two-pointer-init',
                    title: 'Two Pointer Setup',
                    pattern: `left, right = 0, len(arr) - 1
while left < right:`,
                    description: 'Classic two pointer technique'
                },
                {
                    id: 'exception-handling',
                    title: 'Exception Handling',
                    pattern: `try:
    result = risky_operation()
except ValueError as e:
    return None`,
                    description: 'Error handling pattern'
                }
            ],
            
            javascript: [
                {
                    id: 'array-iteration',
                    title: 'Array Iteration',
                    pattern: `for (let i = 0; i < arr.length; i++) {`,
                    description: 'Basic for loop'
                },
                {
                    id: 'map-usage',
                    title: 'Map Operations',
                    pattern: `const map = new Map();
if (map.has(key)) {
    return map.get(key);
}`,
                    description: 'Map data structure usage'
                },
                {
                    id: 'array-methods',
                    title: 'Array Methods',
                    pattern: `const result = arr.filter(x => x > 0).map(x => x * 2);`,
                    description: 'Functional array operations'
                }
            ]
        };
    }
    
    // Get a random problem for the specified topic and language
    getRandomProblemByTopic(topic, language = 'python') {
        const problems = this.problems[language]?.[topic] || this.problems.python[topic] || [];
        if (problems.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * problems.length);
        return { ...problems[randomIndex] }; // Return a copy
    }
    
    // Get a random problem for the specified language (any topic)
    getRandomProblem(language = 'python') {
        const languageProblems = this.problems[language] || this.problems.python;
        const allTopics = Object.keys(languageProblems);
        const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
        
        return this.getRandomProblemByTopic(randomTopic, language);
    }
    
    // Get a specific problem by ID, topic and language
    getProblem(id, topic, language = 'python') {
        const problems = this.problems[language]?.[topic] || this.problems.python[topic] || [];
        return problems.find(p => p.id === id);
    }
    
    // Get all problems for a topic and language
    getProblemsForTopic(topic, language = 'python') {
        return this.problems[language]?.[topic] || this.problems.python[topic] || [];
    }
    
    // Get a random micro drill
    getRandomMicroDrill(language = 'python') {
        const drills = this.microDrills[language] || this.microDrills.python;
        const randomIndex = Math.floor(Math.random() * drills.length);
        return { ...drills[randomIndex] };
    }
    
    // Get all micro drills for a language
    getMicroDrillsForLanguage(language = 'python') {
        return this.microDrills[language] || this.microDrills.python;
    }
    
    // Get all available topics for a language
    getAvailableTopics(language = 'python') {
        return Object.keys(this.problems[language] || this.problems.python);
    }
    
    // Get all available languages
    getAvailableLanguages() {
        return Object.keys(this.problems);
    }
}

// Create global instance
window.problemsDB = new ProblemsDatabase();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProblemsDatabase;
}
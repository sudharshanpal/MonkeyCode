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
                    },
                    {
                        id: 'contains-duplicate',
                        title: 'Contains Duplicate',
                        topic: 'array',
                        description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
                        solution: `def containsDuplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
                        patterns: ['array', 'hash_set']
                    },
                    {
                        id: 'product-except-self',
                        title: 'Product of Array Except Self',
                        topic: 'array',
                        description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].`,
                        solution: `def productExceptSelf(nums):
    n = len(nums)
    result = [1] * n
    
    # Left pass
    for i in range(1, n):
        result[i] = result[i-1] * nums[i-1]
    
    # Right pass
    right = 1
    for i in range(n-1, -1, -1):
        result[i] *= right
        right *= nums[i]
    
    return result`,
                        patterns: ['array', 'prefix_sum']
                    },
                    {
                        id: 'maximum-subarray',
                        title: 'Maximum Subarray',
                        topic: 'array',
                        description: `Given an integer array nums, find the contiguous subarray with the largest sum, and return its sum.`,
                        solution: `def maxSubArray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
                        patterns: ['array', 'dynamic_programming', 'kadane_algorithm']
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
                    },
                    {
                        id: 'longest-substring-without-repeating',
                        title: 'Longest Substring Without Repeating Characters',
                        topic: 'string',
                        description: `Given a string s, find the length of the longest substring without repeating characters.`,
                        solution: `def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
                        patterns: ['string', 'sliding_window', 'hash_set']
                    },
                    {
                        id: 'group-anagrams',
                        title: 'Group Anagrams',
                        topic: 'string',
                        description: `Given an array of strings strs, group the anagrams together.`,
                        solution: `def groupAnagrams(strs):
    anagram_groups = {}
    
    for s in strs:
        sorted_str = ''.join(sorted(s))
        if sorted_str in anagram_groups:
            anagram_groups[sorted_str].append(s)
        else:
            anagram_groups[sorted_str] = [s]
    
    return list(anagram_groups.values())`,
                        patterns: ['string', 'hash_table', 'sorting']
                    },
                    {
                        id: 'valid-parentheses-string',
                        title: 'Valid Parentheses String',
                        topic: 'string',
                        description: `Given a string s containing only three types of characters: '(', ')' and '*', return true if s is valid.`,
                        solution: `def checkValidString(s):
    min_open = max_open = 0
    
    for char in s:
        if char == '(':
            min_open += 1
            max_open += 1
        elif char == ')':
            min_open -= 1
            max_open -= 1
        else:  # char == '*'
            min_open -= 1
            max_open += 1
        
        if max_open < 0:
            return False
        
        min_open = max(0, min_open)
    
    return min_open == 0`,
                        patterns: ['string', 'greedy', 'stack']
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
                    },
                    {
                        id: 'linked-list-cycle',
                        title: 'Linked List Cycle',
                        topic: 'linked-list',
                        description: `Given head, the head of a linked list, determine if the linked list has a cycle in it.`,
                        solution: `def hasCycle(head):
    if not head or not head.next:
        return False
    
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False`,
                        patterns: ['linked_list', 'two_pointer', 'floyd_cycle']
                    },
                    {
                        id: 'remove-nth-node',
                        title: 'Remove Nth Node From End of List',
                        topic: 'linked-list',
                        description: `Given the head of a linked list, remove the nth node from the end of the list and return its head.`,
                        solution: `def removeNthFromEnd(head, n):
    dummy = ListNode(0)
    dummy.next = head
    first = second = dummy
    
    # Move first n+1 steps ahead
    for _ in range(n + 1):
        first = first.next
    
    # Move both until first reaches end
    while first:
        first = first.next
        second = second.next
    
    # Skip the nth node
    second.next = second.next.next
    
    return dummy.next`,
                        patterns: ['linked_list', 'two_pointer']
                    },
                    {
                        id: 'reorder-list',
                        title: 'Reorder List',
                        topic: 'linked-list',
                        description: `You are given the head of a singly linked-list. Reorder the list to be on the following form: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …`,
                        solution: `def reorderList(head):
    if not head or not head.next:
        return
    
    # Find middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    prev = None
    curr = slow.next
    slow.next = None
    
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    
    # Merge two halves
    first = head
    second = prev
    
    while second:
        temp1 = first.next
        temp2 = second.next
        first.next = second
        second.next = temp1
        first = temp1
        second = temp2`,
                        patterns: ['linked_list', 'two_pointer', 'reverse']
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
                    },
                    {
                        id: 'daily-temperatures',
                        title: 'Daily Temperatures',
                        topic: 'stack',
                        description: `Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.`,
                        solution: `def dailyTemperatures(temperatures):
    n = len(temperatures)
    result = [0] * n
    stack = []
    
    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_index = stack.pop()
            result[prev_index] = i - prev_index
        stack.append(i)
    
    return result`,
                        patterns: ['stack', 'monotonic_stack', 'array']
                    },
                    {
                        id: 'evaluate-rpn',
                        title: 'Evaluate Reverse Polish Notation',
                        topic: 'stack',
                        description: `Evaluate the value of an arithmetic expression in Reverse Polish Notation.`,
                        solution: `def evalRPN(tokens):
    stack = []
    operators = {'+', '-', '*', '/'}
    
    for token in tokens:
        if token in operators:
            b = stack.pop()
            a = stack.pop()
            
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            elif token == '/':
                stack.append(int(a / b))
        else:
            stack.append(int(token))
    
    return stack[0]`,
                        patterns: ['stack', 'math', 'parsing']
                    },
                    {
                        id: 'largest-rectangle-histogram',
                        title: 'Largest Rectangle in Histogram',
                        topic: 'stack',
                        description: `Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.`,
                        solution: `def largestRectangleArea(heights):
    stack = []
    max_area = 0
    heights.append(0)  # Add sentinel
    
    for i, h in enumerate(heights):
        while stack and h < heights[stack[-1]]:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    
    return max_area`,
                        patterns: ['stack', 'monotonic_stack', 'area_calculation']
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
                    },
                    {
                        id: 'same-tree',
                        title: 'Same Tree',
                        topic: 'binary-tree',
                        description: `Given the roots of two binary trees p and q, write a function to check if they are the same or not.`,
                        solution: `def isSameTree(p, q):
    if not p and not q:
        return True
    
    if not p or not q:
        return False
    
    return (p.val == q.val and
            isSameTree(p.left, q.left) and
            isSameTree(p.right, q.right))`,
                        patterns: ['binary_tree', 'recursion', 'dfs']
                    },
                    {
                        id: 'subtree-of-another-tree',
                        title: 'Subtree of Another Tree',
                        topic: 'binary-tree',
                        description: `Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot.`,
                        solution: `def isSubtree(root, subRoot):
    if not subRoot:
        return True
    if not root:
        return False
    
    if isSameTree(root, subRoot):
        return True
    
    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)

def isSameTree(p, q):
    if not p and not q:
        return True
    if not p or not q:
        return False
    
    return (p.val == q.val and
            isSameTree(p.left, q.left) and
            isSameTree(p.right, q.right))`,
                        patterns: ['binary_tree', 'recursion', 'dfs']
                    },
                    {
                        id: 'lowest-common-ancestor',
                        title: 'Lowest Common Ancestor of a Binary Search Tree',
                        topic: 'binary-tree',
                        description: `Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST.`,
                        solution: `def lowestCommonAncestor(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
    
    return None`,
                        patterns: ['binary_tree', 'bst', 'tree_traversal']
                    },
                    {
                        id: 'binary-tree-level-order',
                        title: 'Binary Tree Level Order Traversal',
                        topic: 'binary-tree',
                        description: `Given the root of a binary tree, return the level order traversal of its nodes' values.`,
                        solution: `def levelOrder(root):
    if not root:
        return []
    
    result = []
    queue = [root]
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.pop(0)
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result`,
                        patterns: ['binary_tree', 'bfs', 'level_order']
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
                    },
                    {
                        id: 'coin-change',
                        title: 'Coin Change',
                        topic: 'dynamic-programming',
                        description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.`,
                        solution: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1`,
                        patterns: ['dynamic_programming', 'bottom_up']
                    },
                    {
                        id: 'longest-increasing-subsequence',
                        title: 'Longest Increasing Subsequence',
                        topic: 'dynamic-programming',
                        description: `Given an integer array nums, return the length of the longest strictly increasing subsequence.`,
                        solution: `def lengthOfLIS(nums):
    if not nums:
        return 0
    
    dp = [1] * len(nums)
    
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)`,
                        patterns: ['dynamic_programming', 'array']
                    },
                    {
                        id: 'word-break',
                        title: 'Word Break',
                        topic: 'dynamic-programming',
                        description: `Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.`,
                        solution: `def wordBreak(s, wordDict):
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[len(s)]`,
                        patterns: ['dynamic_programming', 'string', 'hash_set']
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
                    },
                    {
                        id: 'course-schedule',
                        title: 'Course Schedule',
                        topic: 'graph',
                        description: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.`,
                        solution: `def canFinish(numCourses, prerequisites):
    graph = [[] for _ in range(numCourses)]
    in_degree = [0] * numCourses
    
    # Build graph and calculate in-degrees
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    
    # Find courses with no prerequisites
    queue = []
    for i in range(numCourses):
        if in_degree[i] == 0:
            queue.append(i)
    
    completed = 0
    while queue:
        course = queue.pop(0)
        completed += 1
        
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    
    return completed == numCourses`,
                        patterns: ['graph', 'topological_sort', 'bfs']
                    },
                    {
                        id: 'pacific-atlantic-water-flow',
                        title: 'Pacific Atlantic Water Flow',
                        topic: 'graph',
                        description: `There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. Given an m x n integer matrix heights where heights[r][c] represents the height above sea level of the cell at coordinate (r, c).`,
                        solution: `def pacificAtlantic(heights):
    if not heights or not heights[0]:
        return []
    
    m, n = len(heights), len(heights[0])
    pacific = set()
    atlantic = set()
    
    def dfs(r, c, visited):
        visited.add((r, c))
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < m and 0 <= nc < n and
                (nr, nc) not in visited and
                heights[nr][nc] >= heights[r][c]):
                dfs(nr, nc, visited)
    
    # DFS from Pacific borders
    for i in range(m):
        dfs(i, 0, pacific)
        dfs(i, n - 1, atlantic)
    
    for j in range(n):
        dfs(0, j, pacific)
        dfs(m - 1, j, atlantic)
    
    return list(pacific & atlantic)`,
                        patterns: ['graph', 'dfs', 'matrix', 'backtracking']
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
                    },
                    {
                        id: 'combination-sum',
                        title: 'Combination Sum',
                        topic: 'backtracking',
                        description: `Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.`,
                        solution: `def combinationSum(candidates, target):
    result = []
    
    def backtrack(start, path, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(i, path, remaining - candidates[i])
            path.pop()
    
    backtrack(0, [], target)
    return result`,
                        patterns: ['backtracking', 'recursion', 'array']
                    },
                    {
                        id: 'n-queens',
                        title: 'N-Queens',
                        topic: 'backtracking',
                        description: `The n-queens puzzle is the problem of placing n queens on an n×n chessboard such that no two queens attack each other.`,
                        solution: `def solveNQueens(n):
    result = []
    board = ['.' * n for _ in range(n)]
    
    def is_safe(row, col):
        # Check column
        for i in range(row):
            if board[i][col] == 'Q':
                return False
        
        # Check diagonal
        for i, j in zip(range(row-1, -1, -1), range(col-1, -1, -1)):
            if board[i][j] == 'Q':
                return False
        
        # Check anti-diagonal
        for i, j in zip(range(row-1, -1, -1), range(col+1, n)):
            if board[i][j] == 'Q':
                return False
        
        return True
    
    def backtrack(row):
        if row == n:
            result.append(board[:])
            return
        
        for col in range(n):
            if is_safe(row, col):
                board[row] = board[row][:col] + 'Q' + board[row][col+1:]
                backtrack(row + 1)
                board[row] = board[row][:col] + '.' + board[row][col+1:]
    
    backtrack(0)
    return result`,
                        patterns: ['backtracking', 'recursion', 'chess', 'constraint_satisfaction']
                    },
                    {
                        id: 'word-search',
                        title: 'Word Search',
                        topic: 'backtracking',
                        description: `Given an m x n grid of characters board and a string word, return true if word exists in the grid.`,
                        solution: `def exist(board, word):
    if not board or not word:
        return False
    
    m, n = len(board), len(board[0])
    
    def backtrack(r, c, index):
        if index == len(word):
            return True
        
        if (r < 0 or r >= m or c < 0 or c >= n or
            board[r][c] != word[index]):
            return False
        
        # Mark as visited
        temp = board[r][c]
        board[r][c] = '#'
        
        # Explore all directions
        found = (backtrack(r+1, c, index+1) or
                backtrack(r-1, c, index+1) or
                backtrack(r, c+1, index+1) or
                backtrack(r, c-1, index+1))
        
        # Restore original value
        board[r][c] = temp
        
        return found
    
    for i in range(m):
        for j in range(n):
            if backtrack(i, j, 0):
                return True
    
    return False`,
                        patterns: ['backtracking', 'matrix', 'dfs', 'string']
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

// Create global instance (only in browser environment)
if (typeof window !== 'undefined') {
    window.problemsDB = new ProblemsDatabase();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProblemsDatabase;
}
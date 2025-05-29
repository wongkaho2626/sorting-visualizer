import { useState, useEffect, useCallback, useRef } from 'react';

interface SortRecord {
  algorithm: SortingAlgorithm;
  time: number;
  arraySize: number;
  timestamp: Date;
}

type SortingAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap' | 
  'comb' | 'cocktail' | 'gnome' | 'tree' | 'pancake' | 'bitonic';

interface SortingVisualizerProps {
  arraySize?: number;
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ arraySize: initialSize = 20 }) => {
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [comparing, setComparing] = useState<[number, number] | null>(null);
  const [swapping, setSwapping] = useState<[number, number] | null>(null);
  const [timer, setTimer] = useState(0);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [history, setHistory] = useState<SortRecord[]>([]);
  const [currentSize, setCurrentSize] = useState(initialSize);
  const [speed, setSpeed] = useState(50); // Speed value between 1-100
  const sortingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const currentTimerRef = useRef(0);

  // Calculate delay based on speed (inverse relationship)
  const getDelay = () => {
    // Map speed (1-100) to delay (200ms-1ms)
    return Math.floor(200 - (speed * 1.98)); // This gives us 200ms at speed 1 and 2ms at speed 100
  };

  // Update timer effect to sync with ref
  useEffect(() => {
    currentTimerRef.current = timer;
  }, [timer]);

  // Timer effect
  useEffect(() => {
    if (sorting && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 10);
      }, 10);
    } else if (!sorting && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [sorting]);

  // Add record to history
  const addToHistory = useCallback(() => {
    const record: SortRecord = {
      algorithm,
      time: currentTimerRef.current,
      arraySize: array.length,
      timestamp: new Date(),
    };
    setHistory(prev => [record, ...prev].slice(0, 10)); // Keep only last 10 records
  }, [algorithm, array.length]);

  // Update completion handling in sorting algorithms
  const handleSortingComplete = useCallback(() => {
    if (sortingRef.current) {
      // Ensure timer is stopped before adding to history
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setCompleted(true);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      
      // Add to history after ensuring timer is final
      setTimeout(() => {
        addToHistory();
      }, 0);
    }
  }, [addToHistory]);

  // Generate random array
  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: currentSize }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setCompleted(false);
    setComparing(null);
    setSwapping(null);
    setSorting(false);
    sortingRef.current = false;
    setTimer(0);
    currentTimerRef.current = 0;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [currentSize]);

  // Initialize array when size changes
  useEffect(() => {
    generateArray();
  }, [generateArray, currentSize]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      sortingRef.current = false;
      setSorting(false);
      setComparing(null);
      setSwapping(null);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Format time function
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
  };

  // Format date function
  const formatDate = (date: Date) => {
    return date.toLocaleTimeString();
  };

  // Bubble sort implementation
  const bubbleSort = async () => {
    setSorting(true);
    sortingRef.current = true;
    const arr = [...array];
    const n = arr.length;
    const delay = getDelay();

    try {
      for (let i = 0; i < n - 1 && sortingRef.current; i++) {
        for (let j = 0; j < n - i - 1 && sortingRef.current; j++) {
          if (!sortingRef.current) return;

          setComparing([j, j + 1]);
          await new Promise(resolve => setTimeout(resolve, delay));

          if (arr[j] > arr[j + 1]) {
            setSwapping([j, j + 1]);
            
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            setArray([...arr]);
            
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          if (sortingRef.current) {
            setSwapping(null);
          }
        }
      }
      
      handleSortingComplete();
    } catch (error) {
      console.error('Sorting error:', error);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      setSwapping(null);
    }
  };

  // Selection sort implementation
  const selectionSort = async () => {
    setSorting(true);
    sortingRef.current = true;
    const arr = [...array];
    const n = arr.length;
    const delay = getDelay();

    try {
      for (let i = 0; i < n - 1 && sortingRef.current; i++) {
        let minIdx = i;
        
        // Find the minimum element in the unsorted part
        for (let j = i + 1; j < n && sortingRef.current; j++) {
          if (!sortingRef.current) return;
          
          setComparing([minIdx, j]);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
          }
        }
        
        // Swap the found minimum element with the first element of the unsorted part
        if (minIdx !== i) {
          setSwapping([i, minIdx]);
          const temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        if (sortingRef.current) {
          setSwapping(null);
        }
      }
      
      handleSortingComplete();
    } catch (error) {
      console.error('Sorting error:', error);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      setSwapping(null);
    }
  };

  // Insertion Sort implementation
  const insertionSort = async () => {
    setSorting(true);
    sortingRef.current = true;
    const arr = [...array];
    const n = arr.length;
    const delay = getDelay();

    try {
      for (let i = 1; i < n && sortingRef.current; i++) {
        const key = arr[i];
        let j = i - 1;

        setComparing([i, j]);
        await new Promise(resolve => setTimeout(resolve, delay));

        while (j >= 0 && arr[j] > key && sortingRef.current) {
          setSwapping([j, j + 1]);
          arr[j + 1] = arr[j];
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          j--;
          if (j >= 0) {
            setComparing([i, j]);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
        
        arr[j + 1] = key;
        setArray([...arr]);
        setSwapping(null);
      }

      handleSortingComplete();
    } catch (error) {
      console.error('Sorting error:', error);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      setSwapping(null);
    }
  };

  // Merge Sort implementation
  const merge = async (arr: number[], left: number, mid: number, right: number) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    const delay = getDelay();

    let i = 0, j = 0, k = left;

    while (i < n1 && j < n2 && sortingRef.current) {
      setComparing([left + i, mid + 1 + j]);
      await new Promise(resolve => setTimeout(resolve, delay));

      if (L[i] <= R[j]) {
        setSwapping([k, left + i]);
        arr[k] = L[i];
        i++;
      } else {
        setSwapping([k, mid + 1 + j]);
        arr[k] = R[j];
        j++;
      }
      
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, delay));
      k++;
    }

    while (i < n1 && sortingRef.current) {
      setSwapping([k, left + i]);
      arr[k] = L[i];
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, delay));
      i++;
      k++;
    }

    while (j < n2 && sortingRef.current) {
      setSwapping([k, mid + 1 + j]);
      arr[k] = R[j];
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, delay));
      j++;
      k++;
    }

    setSwapping(null);
  };

  const mergeSort = async (arr: number[], left: number, right: number) => {
    if (left < right && sortingRef.current) {
      const mid = Math.floor((left + right) / 2);
      await mergeSort(arr, left, mid);
      await mergeSort(arr, mid + 1, right);
      await merge(arr, left, mid, right);
    }
  };

  const mergeSortStart = async () => {
    setSorting(true);
    sortingRef.current = true;
    const arr = [...array];
    const delay = getDelay();

    try {
      await mergeSort(arr, 0, arr.length - 1);
      
      handleSortingComplete();
    } catch (error) {
      console.error('Sorting error:', error);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      setSwapping(null);
    }
  };

  // Quick Sort implementation
  const partition = async (arr: number[], low: number, high: number) => {
    const pivot = arr[high];
    let i = low - 1;
    const delay = getDelay();

    for (let j = low; j < high && sortingRef.current; j++) {
      setComparing([j, high]);
      await new Promise(resolve => setTimeout(resolve, delay));

      if (arr[j] < pivot) {
        i++;
        setSwapping([i, j]);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    setSwapping([i + 1, high]);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await new Promise(resolve => setTimeout(resolve, delay));
    setSwapping(null);

    return i + 1;
  };

  const quickSort = async (arr: number[], low: number, high: number) => {
    if (low < high && sortingRef.current) {
      const pi = await partition(arr, low, high);
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
  };

  const quickSortStart = async () => {
    setSorting(true);
    sortingRef.current = true;
    const arr = [...array];
    const delay = getDelay();

    try {
      await quickSort(arr, 0, arr.length - 1);
      
      handleSortingComplete();
    } catch (error) {
      console.error('Sorting error:', error);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      setSwapping(null);
    }
  };

  // Heap Sort implementation
  const heapify = async (arr: number[], n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    const delay = getDelay();

    if (left < n) {
      setComparing([largest, left]);
      await new Promise(resolve => setTimeout(resolve, delay));
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      setComparing([largest, right]);
      await new Promise(resolve => setTimeout(resolve, delay));
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i && sortingRef.current) {
      setSwapping([i, largest]);
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, delay));
      await heapify(arr, n, largest);
    }
  };

  const heapSort = async () => {
    setSorting(true);
    sortingRef.current = true;
    const arr = [...array];
    const n = arr.length;
    const delay = getDelay();

    try {
      // Build max heap
      for (let i = Math.floor(n / 2) - 1; i >= 0 && sortingRef.current; i--) {
        await heapify(arr, n, i);
      }

      // Extract elements from heap one by one
      for (let i = n - 1; i > 0 && sortingRef.current; i--) {
        setSwapping([0, i]);
        [arr[0], arr[i]] = [arr[i], arr[0]];
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, delay));
        await heapify(arr, i, 0);
      }

      handleSortingComplete();
    } catch (error) {
      console.error('Sorting error:', error);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      setSwapping(null);
    }
  };

  // Comb Sort implementation
  const combSort = async () => {
    setSorting(true);
    sortingRef.current = true;
    const arr = [...array];
    const n = arr.length;
    const delay = getDelay();
    let gap = n;
    const shrink = 1.3;
    let sorted = false;

    try {
      while (!sorted && sortingRef.current) {
        gap = Math.floor(gap / shrink);
        if (gap <= 1) {
          gap = 1;
          sorted = true;
        }

        for (let i = 0; i + gap < n && sortingRef.current; i++) {
          setComparing([i, i + gap]);
          await new Promise(resolve => setTimeout(resolve, delay));

          if (arr[i] > arr[i + gap]) {
            setSwapping([i, i + gap]);
            [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
            setArray([...arr]);
            await new Promise(resolve => setTimeout(resolve, delay));
            sorted = false;
          }
          setSwapping(null);
        }
      }

      handleSortingComplete();
    } catch (error) {
      console.error('Sorting error:', error);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      setSwapping(null);
    }
  };

  // Cocktail Shaker Sort implementation
  const cocktailSort = async () => {
    setSorting(true);
    sortingRef.current = true;
    const arr = [...array];
    const n = arr.length;
    const delay = getDelay();
    let swapped = true;
    let start = 0;
    let end = n - 1;

    try {
      while (swapped && sortingRef.current) {
        swapped = false;

        // Forward pass
        for (let i = start; i < end && sortingRef.current; i++) {
          setComparing([i, i + 1]);
          await new Promise(resolve => setTimeout(resolve, delay));

          if (arr[i] > arr[i + 1]) {
            setSwapping([i, i + 1]);
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            setArray([...arr]);
            await new Promise(resolve => setTimeout(resolve, delay));
            swapped = true;
          }
          setSwapping(null);
        }

        if (!swapped) break;
        swapped = false;
        end--;

        // Backward pass
        for (let i = end - 1; i >= start && sortingRef.current; i--) {
          setComparing([i, i + 1]);
          await new Promise(resolve => setTimeout(resolve, delay));

          if (arr[i] > arr[i + 1]) {
            setSwapping([i, i + 1]);
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            setArray([...arr]);
            await new Promise(resolve => setTimeout(resolve, delay));
            swapped = true;
          }
          setSwapping(null);
        }
        start++;
      }

      handleSortingComplete();
    } catch (error) {
      console.error('Sorting error:', error);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      setSwapping(null);
    }
  };

  // Gnome Sort implementation
  const gnomeSort = async () => {
    setSorting(true);
    sortingRef.current = true;
    const arr = [...array];
    const n = arr.length;
    const delay = getDelay();
    let index = 0;

    try {
      while (index < n && sortingRef.current) {
        if (index === 0) {
          index++;
        }

        setComparing([index, index - 1]);
        await new Promise(resolve => setTimeout(resolve, delay));

        if (arr[index] >= arr[index - 1]) {
          index++;
        } else {
          setSwapping([index, index - 1]);
          [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, delay));
          index--;
        }
        setSwapping(null);
      }

      handleSortingComplete();
    } catch (error) {
      console.error('Sorting error:', error);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      setSwapping(null);
    }
  };

  // Tree Sort implementation
  class TreeNode {
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(value: number) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }

  const insertNode = async (root: TreeNode | null, value: number, arr: number[], index: number): Promise<TreeNode> => {
    const delay = getDelay();

    if (!root) {
      return new TreeNode(value);
    }

    setComparing([index, arr.indexOf(root.value)]);
    await new Promise(resolve => setTimeout(resolve, delay));

    if (value < root.value) {
      root.left = await insertNode(root.left, value, arr, index);
    } else {
      root.right = await insertNode(root.right, value, arr, index);
    }

    return root;
  };

  const inorderTraversal = async (root: TreeNode | null, arr: number[], indices: number[]): Promise<void> => {
    const delay = getDelay();
    
    if (root) {
      await inorderTraversal(root.left, arr, indices);
      
      setSwapping([indices[0], arr.indexOf(root.value)]);
      arr[indices[0]] = root.value;
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, delay));
      indices[0]++;
      
      await inorderTraversal(root.right, arr, indices);
    }
  };

  const treeSort = async () => {
    setSorting(true);
    sortingRef.current = true;
    const arr = [...array];
    let root: TreeNode | null = null;

    try {
      // Build BST
      for (let i = 0; i < arr.length && sortingRef.current; i++) {
        root = await insertNode(root, arr[i], arr, i);
      }

      // Traverse BST in-order
      const indices = [0];
      await inorderTraversal(root, arr, indices);
      
      handleSortingComplete();
    } catch (error) {
      console.error('Sorting error:', error);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      setSwapping(null);
    }
  };

  // Pancake Sort implementation
  const flip = async (arr: number[], k: number) => {
    const delay = getDelay();
    let start = 0;
    
    while (start < k) {
      setSwapping([start, k]);
      [arr[start], arr[k]] = [arr[k], arr[start]];
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, delay));
      start++;
      k--;
    }
  };

  const findMax = async (arr: number[], k: number): Promise<number> => {
    const delay = getDelay();
    let maxIndex = 0;
    
    for (let i = 0; i <= k && sortingRef.current; i++) {
      setComparing([maxIndex, i]);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      if (arr[i] > arr[maxIndex]) {
        maxIndex = i;
      }
    }
    
    return maxIndex;
  };

  const pancakeSort = async () => {
    setSorting(true);
    sortingRef.current = true;
    const arr = [...array];
    const n = arr.length;

    try {
      for (let curr_size = n - 1; curr_size > 0 && sortingRef.current; curr_size--) {
        const maxIndex = await findMax(arr, curr_size);
        
        if (maxIndex !== curr_size) {
          if (maxIndex !== 0) {
            await flip(arr, maxIndex);
          }
          await flip(arr, curr_size);
        }
      }
      
      handleSortingComplete();
    } catch (error) {
      console.error('Sorting error:', error);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      setSwapping(null);
    }
  };

  // Bitonic Sort implementation
  const compAndSwap = async (arr: number[], i: number, j: number, dir: boolean) => {
    const delay = getDelay();
    
    setComparing([i, j]);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    if (dir === (arr[i] > arr[j])) {
      setSwapping([i, j]);
      [arr[i], arr[j]] = [arr[j], arr[i]];
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  const bitonicMerge = async (arr: number[], low: number, cnt: number, dir: boolean) => {
    if (cnt > 1 && sortingRef.current) {
      const k = cnt / 2;
      for (let i = low; i < low + k && sortingRef.current; i++) {
        await compAndSwap(arr, i, i + k, dir);
      }
      await bitonicMerge(arr, low, k, dir);
      await bitonicMerge(arr, low + k, k, dir);
    }
  };

  const bitonicSort = async (arr: number[], low: number, cnt: number, dir: boolean) => {
    if (cnt > 1 && sortingRef.current) {
      const k = cnt / 2;
      await bitonicSort(arr, low, k, true);
      await bitonicSort(arr, low + k, k, false);
      await bitonicMerge(arr, low, cnt, dir);
    }
  };

  const bitonicSortStart = async () => {
    setSorting(true);
    sortingRef.current = true;
    const arr = [...array];
    
    try {
      // Bitonic sort requires array length to be power of 2
      const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(arr.length)));
      while (arr.length < nextPowerOfTwo) {
        arr.push(Number.MAX_SAFE_INTEGER);
      }
      
      await bitonicSort(arr, 0, arr.length, true);
      
      // Remove padding
      while (arr[arr.length - 1] === Number.MAX_SAFE_INTEGER) {
        arr.pop();
      }
      
      setArray(arr);
      handleSortingComplete();
    } catch (error) {
      console.error('Sorting error:', error);
      setSorting(false);
      sortingRef.current = false;
      setComparing(null);
      setSwapping(null);
    }
  };

  // Update toggleSort function
  const toggleSort = () => {
    if (sorting) {
      sortingRef.current = false;
      setSorting(false);
      setComparing(null);
      setSwapping(null);
    } else {
      if (completed) {
        setTimer(0);
      }
      switch (algorithm) {
        case 'bubble':
          bubbleSort();
          break;
        case 'selection':
          selectionSort();
          break;
        case 'insertion':
          insertionSort();
          break;
        case 'merge':
          mergeSortStart();
          break;
        case 'quick':
          quickSortStart();
          break;
        case 'heap':
          heapSort();
          break;
        case 'comb':
          combSort();
          break;
        case 'cocktail':
          cocktailSort();
          break;
        case 'gnome':
          gnomeSort();
          break;
        case 'tree':
          treeSort();
          break;
        case 'pancake':
          pancakeSort();
          break;
        case 'bitonic':
          bitonicSortStart();
          break;
      }
    }
  };

  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(e.target.value as SortingAlgorithm);
    generateArray();
  };

  const getBarColor = (index: number) => {
    if (completed) return '#4CAF50';
    if (swapping && (index === swapping[0] || index === swapping[1])) return '#FF5733';
    if (comparing && (index === comparing[0] || index === comparing[1])) return '#FFC300';
    return '#3498db';
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setCurrentSize(newSize);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseInt(e.target.value, 10);
    setSpeed(newSpeed);
  };

  // Calculate bar width based on array size
  const getBarWidth = () => {
    const maxWidth = 20;
    const minWidth = 2;
    const width = Math.max(minWidth, Math.min(maxWidth, 800 / currentSize - 2));
    return `${width}px`;
  };

  return (
    <div className="sorting-visualizer">
      <div className="timer">Time: {formatTime(timer)}</div>
      <div className="controls">
        <div className="size-control">
          <label htmlFor="size-slider">Array Size: {currentSize}</label>
          <input
            id="size-slider"
            type="range"
            min="5"
            max="200"
            value={currentSize}
            onChange={handleSizeChange}
            disabled={sorting}
            className="size-slider"
          />
        </div>
        <div className="speed-control">
          <label htmlFor="speed-slider">Speed: {speed}x</label>
          <input
            id="speed-slider"
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={handleSpeedChange}
            className="speed-slider"
          />
        </div>
        <select 
          value={algorithm} 
          onChange={handleAlgorithmChange}
          disabled={sorting}
          className="algorithm-select"
        >
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="heap">Heap Sort</option>
          <option value="comb">Comb Sort</option>
          <option value="cocktail">Cocktail Shaker Sort</option>
          <option value="gnome">Gnome Sort</option>
          <option value="tree">Tree Sort</option>
          <option value="pancake">Pancake Sort</option>
          <option value="bitonic">Bitonic Sort</option>
        </select>
        <button onClick={generateArray} disabled={sorting}>
          Generate New Array
        </button>
        <button onClick={toggleSort}>
          {sorting ? 'Pause' : completed ? 'Sorted!' : 'Start Sorting'}
        </button>
      </div>
      <div className="visualization-info">
        <div className="color-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#3498db' }}></div>
            <span>Unsorted</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FFC300' }}></div>
            <span>Comparing</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FF5733' }}></div>
            <span>Swapping</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
            <span>Sorted</span>
          </div>
        </div>
      </div>
      <div className="array-container">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              height: `${value * 3}px`,
              width: getBarWidth(),
              backgroundColor: getBarColor(idx),
              margin: '0 1px',
              transform: swapping && (idx === swapping[0] || idx === swapping[1])
                ? 'scale(1.1)'
                : 'scale(1)',
            }}
          />
        ))}
      </div>
      <div className="history-container">
        <h3>Sorting History</h3>
        <div className="history-list">
          {history.map((record, index) => (
            <div key={index} className="history-item">
              <span className="history-algorithm">{record.algorithm}</span>
              <span className="history-time">{formatTime(record.time)}</span>
              <span className="history-size">Size: {record.arraySize}</span>
              <span className="history-timestamp">{formatDate(record.timestamp)}</span>
            </div>
          ))}
          {history.length === 0 && (
            <div className="history-empty">No sorting history yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer; 
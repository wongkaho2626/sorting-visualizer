# Sorting Algorithm Visualizer

A React-based web application that provides interactive visualizations of various sorting algorithms. This tool helps users understand how different sorting algorithms work through animated visualizations.

![Sorting Visualizer Demo](demo.gif)

## Features

### Multiple Sorting Algorithms
- **Basic Sorts**
  - Bubble Sort
  - Selection Sort
  - Insertion Sort
- **Efficient Sorts**
  - Merge Sort
  - Quick Sort
  - Heap Sort
- **Variant Sorts**
  - Comb Sort
  - Cocktail Shaker Sort
  - Gnome Sort
- **Special Sorts**
  - Tree Sort (Binary Search Tree based)
  - Pancake Sort
  - Bitonic Sort

### Interactive Controls
- **Array Size Control**: Adjust array size from 5 to 200 elements
- **Speed Control**: Adjust visualization speed from 1x to 100x
- **Start/Pause**: Control the sorting process
- **Generate New Array**: Create a new random array
- **Algorithm Selection**: Choose from 12 different sorting algorithms

### Visual Features
- **Color-Coded Bars**
  - Blue: Unsorted elements
  - Yellow: Elements being compared
  - Orange: Elements being swapped
  - Green: Sorted elements
- **Real-time Animation**: Smooth transitions for array operations
- **Dynamic Bar Sizing**: Automatic adjustment based on array size

### Performance Tracking
- **Timer**: Real-time tracking of sorting duration
- **History**: Records of previous sorting operations
  - Algorithm used
  - Time taken
  - Array size
  - Timestamp
- **Last 10 Operations**: Maintains a log of recent sorting activities

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/sorting-visualizer.git
cd sorting-visualizer
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## Algorithm Details

### Time Complexities

| Algorithm | Best Case | Average Case | Worst Case | Space Complexity |
|-----------|-----------|--------------|------------|------------------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |
| Comb Sort | O(n log n) | O(n²) | O(n²) | O(1) |
| Cocktail Sort | O(n) | O(n²) | O(n²) | O(1) |
| Gnome Sort | O(n) | O(n²) | O(n²) | O(1) |
| Tree Sort | O(n log n) | O(n log n) | O(n²) | O(n) |
| Pancake Sort | O(n) | O(n²) | O(n²) | O(1) |
| Bitonic Sort | O(log² n) | O(log² n) | O(log² n) | O(n) |

## Implementation Details

### Visualization Components
- **Bar Chart**: Represents array elements
- **Control Panel**: User interface for algorithm selection and controls
- **History Panel**: Displays sorting history
- **Timer Display**: Shows elapsed time
- **Color Legend**: Explains the meaning of different colors

### Technical Stack
- React + Vite
- TypeScript
- CSS3 Animations
- Modern JavaScript (ES6+)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Inspired by various sorting algorithm visualizations
- Built with React and Vite
- Developed for educational purposes

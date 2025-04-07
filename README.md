# ♟️ React Chess AI: Strategic AI Opponent with Minimax Algorithm

A sophisticated chess web application featuring an AI opponent that thinks strategically (~1300-1500 ELO rating). Built with React, TypeScript, and Tailwind CSS, this project brings advanced chess algorithms to your browser.

## 🏆 Key Features

### 🤖 Intelligent AI Opponent
- **Minimax algorithm with alpha-beta pruning** for efficient decision-making
- **Two difficulty modes**: Easy (Beginner) and Medium (Intermediate ~1300-1500 ELO)
- **Human-like draw analysis**: Evaluates material and position before accepting/rejecting draws
- **Game phase awareness**: Adjusts strategy for middlegame and endgame scenarios

### 🎮 Player Experience
- Real-time board evaluation (material count, piece activity, positioning)
- Smooth move animations and legal move highlighting
- Clean, responsive UI with dark/light mode toggle
- Intuitive controls and game status indicators

### ⚙️ Technical Highlights
- Optimized algorithm performance with alpha-beta pruning
- Type-safe implementation with TypeScript
- Modern UI with Tailwind CSS
- Fully responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
```
git clone https://github.com/yourusername/react-chess-ai.git
```
```
cd react-chess-ai
```
```
npm install
```
```
npm start
```

The app will run on `http://localhost:3000`

🧠 How the AI Works
-------------------

The chess AI combines several advanced techniques:

1.  **Minimax Algorithm**: Explores possible moves 3-4 plies deep

2.  **Alpha-Beta Pruning**: Dramatically reduces computation time by pruning irrelevant branches

3.  **Position Evaluation**: Scores positions based on:

    -   Material balance

    -   Piece activity and mobility

    -   King safety

    -   Pawn structure

4.  **Draw Logic**: AI evaluates draw offers based on:

    -   Current material advantage

    -   Positional factors

    -   Game phase

🛠️ Tech Stack
--------------

-   **Frontend**: ⚛️ React 18

-   **Language**: 📜 TypeScript

-   **Styling**: 🎨 Tailwind CSS

-   **Chess Logic**: ♟️ Custom implementation

-   **Animation**: ✨ React Transition Group

🤝 Contributing
---------------

Contributions are welcome! Please open an issue first to discuss what you'd like to change.
-------------

* * * * *

**Challenge accepted?** Can you outsmart the AI and trick it into a bad draw? Give it a try! 🏁

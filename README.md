# Sky Island Game

An online multiplayer strategy game inspired by classic building and colonization games. Build settlements, connect floating islands with roads, and compete to be the first to reach 10 victory points.

## 🎮 Features

- **Real-Time Multiplayer**: Play with up to 4 players online
- **Modern Interface**: Responsive design optimized for mobile and desktop
- **Progressive Web App (PWA)**: Install it on your device for a native experience
- **Push Notifications**: Receive alerts when it's your turn
- **Real-Time Synchronization**: Uses Firebase to keep all players synchronized

## 🚀 Technologies

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Firebase Firestore** for real-time synchronization
- **Capacitor** for mobile support
- **PWA** with service workers

## 📋 Game Rules

### Objective
Be the first player to reach **10 Victory Points (VP)**.

### How to Get Points

1. **Settlements**: 1 VP each
2. **Cities**: 2 VP each (replace a settlement)
3. **Longest Road**: 2 VP (continuous road of 5+ segments)
4. **Largest Army**: 2 VP (3+ Knight cards played)
5. **Development Cards**: Some grant 1 VP

### Game Phases

#### 1. Initial Setup
- Players roll dice to determine order
- Each player places 2 settlements and 2 roads in "snake" order
- In the second round, players receive resources from the second settlement

#### 2. Game Turn
1. **Roll Dice**: Generates resources for all players
2. **Trade**: Exchange resources with the bank or other players
3. **Build**: Place roads, settlements, or cities
4. **Buy Cards**: Acquire development cards
5. **Play Cards**: Use development cards (only 1 per turn)
6. **End Turn**: Finish your turn

### Resources

- **Wood** 🌲: For roads and settlements
- **Brick** 🧱: For roads and settlements
- **Sheep** 🐑: For settlements and development cards
- **Wheat** 🌾: For settlements, cities, and cards
- **Ore** ⛏️: For cities and cards

### Buildings

- **Road**: 1 Wood + 1 Brick (0 VP)
- **Settlement**: 1 Wood + 1 Brick + 1 Sheep + 1 Wheat (1 VP)
- **City**: 2 Wheat + 3 Ore (2 VP, replaces a settlement)
- **Development Card**: 1 Sheep + 1 Wheat + 1 Ore

### Trading

- **Standard Rate**: 4:1 (4 same resources for 1 any resource)
- **General Harbor**: 3:1 (if you have a 3:1 harbor)
- **Specialized Harbor**: 2:1 (if you have a specific resource harbor)

### The Robber

When a **7** is rolled:
1. Players with more than 7 cards discard half
2. The player who rolled the 7 moves the robber
3. The robber blocks production of the hexagon where it's placed
4. The player steals 1 random card from an adjacent opponent

### Development Cards

- **Knight**: Moves the robber and counts toward Largest Army
- **Monopoly**: Take all resources of one type from all opponents
- **Year of Plenty**: Take 2 any resources from the bank
- **Road Building**: Place 2 roads for free
- **Victory Point**: 1 VP (remains hidden until victory)

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 PWA Installation

1. Open the application in your mobile browser
2. Look for the "Install" or "Add to Home Screen" option
3. The application will install as a native app

## 🔧 Configuration

### Firebase

The project uses Firebase Firestore for synchronization. Make sure to configure your Firebase project in `src/firebase.ts`.

### Environment Variables

No additional environment variables are required for local development.

## 🎯 Technical Features

- **Reactive State**: State management with custom hooks
- **Real-Time Synchronization**: Firebase Firestore listeners
- **Performance Optimization**: Lazy loading and code splitting
- **Accessibility**: ARIA labels and keyboard navigation
- **Responsive Design**: Adapted for mobile, tablets, and desktop

## 📝 License

This project is an educational and entertainment game.

## 🤝 Contributing

Contributions are welcome. Please open an issue or pull request to discuss changes.

---

**Enjoy building your empire on the floating islands!** 🏝️✨

# 🎱 Physics Simulator

An interactive web-based physics simulation application built with modern React technologies. Explore the fascinating world of physics through hands-on experiments with collision momentum, elastic and inelastic collisions.

## 📖 Description

This project is a comprehensive physics education tool that allows users to:
- Visualize and interact with collision simulations
- Adjust physical parameters in real-time (mass, velocity, radius)
- Switch between elastic and inelastic collision modes
- Observe conservation of momentum and energy principles
- Learn physics concepts through interactive experimentation

The application features a clean, intuitive interface with a welcome screen, simulation controls, and live data displays for educational purposes.

## ✨ Features

- **Interactive Collision Simulator**: Real-time physics simulation of ball collisions
- **Adjustable Parameters**: Modify mass, velocity, and radius of colliding objects
- **Collision Modes**: Toggle between elastic and inelastic collisions
- **Live Data Display**: Real-time momentum and kinetic energy calculations
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and custom components
- **Educational Focus**: Designed for physics learning and experimentation

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: TanStack Router (file-based routing)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Runtime**: Bun
- **Linting/Formatting**: Biome
- **Testing**: Vitest
- **UI Components**: Custom pixelact-ui component library

## 🚀 Getting Started

### Prerequisites

- **Bun** (recommended) or Node.js (v18+)
- **Git**

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bimodwilaksono/physics-sim.git
cd physics-sim/_dev
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📜 Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run test` - Run tests with Vitest
- `bun run lint` - Lint code with Biome
- `bun run format` - Format code with Biome
- `bun run check` - Check code formatting and linting

## 🏗️ Building for Production

To create a production build:

```bash
bun run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🧪 Testing

This project uses Vitest for testing:

```bash
bun run test
```

## 🎨 Styling

The project uses Tailwind CSS for styling. Custom styles are in `src/styles.css`, and component-specific styles are in their respective files.

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── pixelact-ui/       # Custom UI library
│   │   ├── footer.tsx         # Footer component
│   │   ├── info-row.tsx       # Data display component
│   │   └── input-range.tsx    # Range input component
├── routes/
│   ├── __root.tsx            # Root layout
│   ├── index.tsx             # Welcome page
│   └── simulator/
│       └── momentum.tsx      # Momentum simulator
└── styles.css                # Global styles
```

## 🔧 Configuration

- **TypeScript**: `tsconfig.json`
- **Vite**: `vite.config.ts`
- **Biome**: `biome.json`
- **Tailwind**: Configured in `tailwind.config.js` (if exists)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [TanStack Router](https://tanstack.com/router)
- Icons from [Lucide](https://lucide.dev)
- UI components inspired by modern design systems

## 📞 Contact

**Bimo Laksono** (A18.2025.00201)
- GitHub: [@bimodwilaksono](https://github.com/bimodwilaksono)

---

*This project was created as an educational tool for learning physics concepts through interactive simulations.*

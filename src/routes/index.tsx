import { createFileRoute, Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/pixelact-ui/card'
import { Button } from '@/components/ui/pixelact-ui/button'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <Card className="min-h-screen bg-transparent border-none shadow-none ">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center flex flex-col mb-20">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-500 leading-tight">
              Physics Simulator
            </h1>
            <p className="text-lg md:text-2xl lg:text-3xl text-gray-700 mb-12  mx-auto leading-relaxed text-center">
              Explore the fascinating world of physics through interactive simulations.
              Learn about momentum, collisions, and energy conservation in an engaging way.
            </p>
          </div>
        </div>
      </div>

      {/* Simulations Section */}
      <div className="mt-100 max-w-7xl mx-auto px-4 py-16 flex-1">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-8 h-full bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-center items-center">
            <div className="text-center">
              <Link to="/simulator/momentum">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all">
                  Momentum Simulator
                </Button>
              </Link>
            </div>
          </Card>

          {/* Placeholder for future simulations */}
          <Card className="p-8 h-full bg-gray-50/80 backdrop-blur-sm border-2 border-dashed border-gray-200 flex flex-col justify-center items-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-4">
                Coming Soon
              </h3>
              <p className="text-gray-500">
                More physics simulations are in development...
              </p>
            </div>
          </Card>

          <Card className="p-8 h-full bg-gray-50/80 backdrop-blur-sm border-2 border-dashed border-gray-200 flex flex-col justify-center items-center">
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-4">
                Coming Soon
              </h3>
              <p className="text-gray-500">
                Exciting new simulations on the way...
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  )
}

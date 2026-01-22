import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {

  console.log('TES')

  return (
    <div className="min-h-screen">
      <text>Hello</text>
    </div>
  )
}

import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/pixelact-ui/card";
import { Button } from "@/components/ui/pixelact-ui/button";

import "../styles.css";
export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div className="min-h-screen min-w-screen flex items-center justify-center  p-4">
			<Card className="w-full max-w-2xl shrink-0 bg-transparent border-none shadow-none">
				<CardHeader className="text-center pb-2">
					<CardTitle className="text-4xl font-bold text-white pixel-font">
						Physics Simulator
					</CardTitle>
					<CardDescription className="text-lg text-gray-300 pixel-font">
						Explore momentum, collisions, and energy conservation through
						interactive simulations.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4 pt-2">
					<Link to="/simulator/momentum" className="w-full">
						<Button variant="default" size="lg" className="w-full pixel-font hover:-translate-y-2">
							Momentum Simulator
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}

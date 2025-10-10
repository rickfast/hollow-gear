import { Card, CardBody, CardHeader } from "@heroui/react";

function App() {
    return (
        <div className="min-h-screen bg-paper-gray p-8">
            <div className="max-w-6xl mx-auto">
                <Card className="bg-steel-wash/80 backdrop-blur-sm border-2 border-gear-brass/30 shadow-xl">
                    <CardHeader className="flex-col items-start pb-0 pt-8 px-8">
                        <h1 className="font-heading text-6xl font-bold text-iron-ink mb-2">
                            Hollow Gear 5E
                        </h1>
                        <p className="text-xl text-aether-blue font-medium">
                            Steampunk & Psionics Character System
                        </p>
                    </CardHeader>
                    <CardBody className="px-8 py-8">
                        <div className="space-y-6">
                            {/* Welcome Section */}
                            <div className="p-6 bg-gradient-to-br from-aether-glow/20 to-aether-blue/10 rounded-lg border-2 border-aether-blue/30">
                                <h2 className="font-heading text-3xl font-semibold text-aether-blue mb-3">
                                    Welcome to Hollowgear
                                </h2>
                                <p className="text-iron-ink/80 leading-relaxed">
                                    A world where steam-powered technology meets psionic energy. The
                                    Etherborne species harness the power of Aether Flux through
                                    intricate clockwork and mental prowess.
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-5 bg-gradient-to-br from-gear-brass/20 to-radiant-gold/10 rounded-lg border-2 border-gear-brass/40 hover:border-gear-brass/60 transition-all hover:shadow-lg">
                                    <h3 className="font-heading text-2xl font-semibold text-gear-brass mb-1">
                                        7 Species
                                    </h3>
                                    <p className="text-sm text-iron-ink/70">
                                        From Aqualoth to Avenar, each with unique traits
                                    </p>
                                </div>
                                <div className="p-5 bg-gradient-to-br from-aether-blue/20 to-aether-glow/10 rounded-lg border-2 border-aether-blue/40 hover:border-aether-blue/60 transition-all hover:shadow-lg">
                                    <h3 className="font-heading text-2xl font-semibold text-aether-blue mb-1">
                                        7 Classes
                                    </h3>
                                    <p className="text-sm text-iron-ink/70">
                                        Arcanist, Templar, Tweaker, and more
                                    </p>
                                </div>
                                <div className="p-5 bg-gradient-to-br from-verdigris-green/20 to-verdigris-green/10 rounded-lg border-2 border-verdigris-green/40 hover:border-verdigris-green/60 transition-all hover:shadow-lg">
                                    <h3 className="font-heading text-2xl font-semibold text-verdigris-green mb-1">
                                        Gear & Mods
                                    </h3>
                                    <p className="text-sm text-iron-ink/70">
                                        Extensive equipment and modification system
                                    </p>
                                </div>
                            </div>

                            {/* Quote Section */}
                            <div className="p-6 bg-gradient-to-r from-rust-red/20 via-gear-brass/20 to-radiant-gold/20 rounded-lg border-2 border-gear-brass/30">
                                <p className="text-center text-iron-ink font-medium italic text-lg">
                                    "If it rattles, I fix it. If it screams, I patent it."
                                </p>
                                <p className="text-center text-smokestack-gray text-sm mt-2">
                                    — Lyrra Quenchcoil, Rendai Artifex
                                </p>
                            </div>

                            {/* Features Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-aether-glow/10 rounded-lg border border-aether-blue/30">
                                    <h4 className="font-heading text-lg font-semibold text-aether-blue mb-2">
                                        Psionic Powers
                                    </h4>
                                    <p className="text-sm text-iron-ink/70">
                                        Master 30 unique mindcraft abilities across 6 disciplines
                                    </p>
                                </div>
                                <div className="p-4 bg-verdigris-green/10 rounded-lg border border-verdigris-green/30">
                                    <h4 className="font-heading text-lg font-semibold text-verdigris-green mb-2">
                                        Resonance System
                                    </h4>
                                    <p className="text-sm text-iron-ink/70">
                                        Channel divine energy through Templar miracles
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default App;

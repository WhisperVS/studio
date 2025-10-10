"use client";

import { useState } from "react";

export default function EffectsDemo() {
  const [activeEffect, setActiveEffect] = useState<string | null>(null);

  const effectCategories = [
    {
      name: "Glass Morphism",
      effects: [
        { id: "glass-effect", label: "Liquid Glass", description: "Frosted glass with blur effect" },
        { id: "frosted-glass", label: "Frosted Glass", description: "Enhanced backdrop blur" },
      ]
    },
    {
      name: "Premium Cards",
      effects: [
        { id: "premium-card", label: "Premium Card", description: "Shimmer with elevation" },
        { id: "ultra-premium-card", label: "Ultra Premium", description: "Combined all effects" },
        { id: "depth-3d", label: "3D Depth", description: "Perspective transform" },
      ]
    },
    {
      name: "Hover Animations",
      effects: [
        { id: "liquid-button", label: "Liquid Button", description: "Morphing borders" },
        { id: "shimmer-effect", label: "Shimmer", description: "Sliding light effect" },
        { id: "float-on-hover", label: "Float", description: "Floating animation" },
        { id: "scale-bounce", label: "Bounce", description: "Scale bounce effect" },
      ]
    },
    {
      name: "Border Effects",
      effects: [
        { id: "glow-border", label: "Glow Border", description: "Animated gradient border" },
        { id: "rainbow-border", label: "Rainbow Border", description: "Multi-color border" },
        { id: "neon-glow", label: "Neon Glow", description: "Neon text and border glow" },
      ]
    },
    {
      name: "Advanced Effects",
      effects: [
        { id: "perspective-tilt", label: "Perspective Tilt", description: "3D rotation effect" },
        { id: "liquid-morph", label: "Liquid Morph", description: "Morphing shape" },
        { id: "holographic", label: "Holographic", description: "Rainbow gradient" },
        { id: "aurora-glow", label: "Aurora Glow", description: "Rotating glow" },
      ]
    },
    {
      name: "Interactive",
      effects: [
        { id: "ripple-effect", label: "Ripple", description: "Click ripple effect" },
        { id: "magnetic", label: "Magnetic", description: "Scale on hover" },
        { id: "gradient-animate", label: "Gradient Animate", description: "Animated background" },
      ]
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 neon-glow">
            Premium Effects Showcase
          </h1>
          <p className="text-xl opacity-80">
            Hover over cards to see amazing effects in action!
          </p>
          <p className="text-sm opacity-60 mt-2">
            All effects work seamlessly with both light and dark themes
          </p>
        </div>

        {/* Quick Demo Banner */}
        <div className="mb-12 ultra-premium-card p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">✨ Ultra Premium Card ✨</h2>
          <p className="text-lg opacity-90">
            This card combines multiple effects for the ultimate premium look
          </p>
        </div>

        {/* Effect Categories */}
        {effectCategories.map((category) => (
          <div key={category.name} className="mb-12">
            <h2 className="text-3xl font-bold mb-6 glow-border inline-block px-4 py-2 rounded-lg">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.effects.map((effect) => (
                <div
                  key={effect.id}
                  className={`${effect.id} p-6 rounded-2xl cursor-pointer border-2`}
                  onClick={() => setActiveEffect(effect.id)}
                  style={{
                    background: 'var(--card-background)',
                    borderColor: 'var(--card-border)',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: 'var(--card-text)'
                  }}
                >
                  <h3 className="text-2xl font-bold mb-2">{effect.label}</h3>
                  <p className="text-sm opacity-70 mb-4">{effect.description}</p>
                  <code className="text-xs opacity-50 bg-black/20 px-3 py-1 rounded-full">
                    .{effect.id}
                  </code>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Utility Classes Demo */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Utility Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="soft-glow p-6 rounded-xl text-center" style={{ background: 'var(--card-background)', border: '2px solid var(--card-border)' }}>
              <div className="text-lg font-semibold mb-2">Soft Glow</div>
              <code className="text-xs opacity-70">.soft-glow</code>
            </div>
            <div className="intense-glow p-6 rounded-xl text-center" style={{ background: 'var(--card-background)', border: '2px solid var(--card-border)' }}>
              <div className="text-lg font-semibold mb-2">Intense Glow</div>
              <code className="text-xs opacity-70">.intense-glow</code>
            </div>
            <div className="smooth-transition p-6 rounded-xl text-center" style={{ background: 'var(--card-background)', border: '2px solid var(--card-border)', transform: 'scale(1)' }}>
              <div className="text-lg font-semibold mb-2">Smooth</div>
              <code className="text-xs opacity-70">.smooth-transition</code>
            </div>
            <div className="bounce-transition p-6 rounded-xl text-center" style={{ background: 'var(--card-background)', border: '2px solid var(--card-border)', transform: 'scale(1)' }}>
              <div className="text-lg font-semibold mb-2">Bounce</div>
              <code className="text-xs opacity-70">.bounce-transition</code>
            </div>
          </div>
        </div>

        {/* Combined Effects Examples */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Combined Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-effect premium-card shimmer-effect p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-3">Glass + Premium + Shimmer</h3>
              <p className="opacity-80 mb-4">
                Multiple effects combined for maximum impact
              </p>
              <button className="liquid-button ripple-effect px-6 py-3 rounded-lg font-semibold" style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}>
                Click Me!
              </button>
            </div>

            <div className="frosted-glass depth-3d neon-glow p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-3">Frosted + 3D + Neon</h3>
              <p className="opacity-80 mb-4">
                A stunning combination of depth and glow
              </p>
              <div className="flex gap-3">
                <div className="glow-border px-4 py-2 rounded-lg">✨ Magic</div>
                <div className="rainbow-border px-4 py-2 rounded-lg">🌈 Rainbow</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Showcase */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Interactive Elements</h2>
          <div className="premium-card p-8 rounded-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="liquid-button ripple-effect px-6 py-4 rounded-xl font-bold hover:scale-105 transition-transform" style={{ background: 'var(--card-background)', border: '2px solid var(--card-border)' }}>
                Liquid Button
              </button>
              <button className="magnetic shimmer-effect px-6 py-4 rounded-xl font-bold" style={{ background: 'var(--card-background)', border: '2px solid var(--card-border)' }}>
                Magnetic
              </button>
              <button className="scale-bounce soft-glow px-6 py-4 rounded-xl font-bold" style={{ background: 'var(--card-background)', border: '2px solid var(--card-border)' }}>
                Bounce
              </button>
              <button className="float-on-hover intense-glow px-6 py-4 rounded-xl font-bold" style={{ background: 'var(--card-background)', border: '2px solid var(--card-border)' }}>
                Float
              </button>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="glass-effect p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-4">🎨 How to Use</h2>
          <div className="space-y-3 opacity-90">
            <p>1. Simply add the effect class to any element:</p>
            <code className="block bg-black/30 p-3 rounded-lg text-sm">
              {'<div className="premium-card">Your content</div>'}
            </code>
            <p>2. Combine multiple effects for stunning results:</p>
            <code className="block bg-black/30 p-3 rounded-lg text-sm">
              {'<div className="glass-effect shimmer-effect neon-glow">Amazing!</div>'}
            </code>
            <p>3. All effects automatically adapt to light and dark themes!</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 mb-8">
          <p className="text-lg opacity-70">
            ✨ Premium effects with no !important rules ✨
          </p>
          <p className="text-sm opacity-50 mt-2">
            Pure CSS elegance for both light and dark themes
          </p>
        </div>
      </div>
    </div>
  );
}

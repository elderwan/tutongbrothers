"use client"

import { useEffect, useState, useRef } from "react"

interface Symbol {
    id: number
    char: string
    startX: number
    startY: number
    endX: number
    endY: number
    color: string
    duration: number
    rotation: number
}

const SYMBOLS = ["@", "#", "$", "%", "&", "*", "{", "}", "[", "]", "<", ">", "/", "\\"]
const COLORS = ["#FF8C00", "#00FF00", "#00FFFF"] // Orange, Bright Green, Cyan

export default function CodingSymbolsAnimation() {
    const [symbols, setSymbols] = useState<Symbol[]>([])
    const nextIdRef = useRef(0)

    useEffect(() => {
        console.log('🎨 CodingSymbolsAnimation mounted')

        const createSymbol = (): Symbol => {
            const id = nextIdRef.current++

            // Start from center area
            const startX = (Math.random() - 0.5) * 20 // -10% to 10%
            const startY = (Math.random() - 0.5) * 20

            // End position: radiate outwards
            const angle = Math.random() * Math.PI * 2
            const distance = 150 + Math.random() * 100 // 150-250 pixels
            const endX = startX + Math.cos(angle) * distance
            const endY = startY + Math.sin(angle) * distance

            const symbol = {
                id,
                char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                startX,
                startY,
                endX,
                endY,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                duration: 2 + Math.random() * 2, // 2-4 seconds
                rotation: (Math.random() - 0.5) * 60 // -30deg to 30deg
            }

            console.log(`✨ Created symbol ${id}: ${symbol.char}`, symbol.color)
            return symbol
        }

        // Initial symbols
        const initialSymbols: Symbol[] = []
        for (let i = 0; i < 8; i++) {
            initialSymbols.push(createSymbol())
        }
        setSymbols(initialSymbols)
        console.log(`🎯 Initial symbols count: ${initialSymbols.length}`)

        // Create new symbols periodically
        const interval = setInterval(() => {
            setSymbols(prev => {
                const newSymbol = createSymbol()
                // Keep max 12 symbols, remove old ones
                const updated = [...prev, newSymbol]
                return updated.slice(-12)
            })
        }, 400 + Math.random() * 400) // 0.4-0.8 seconds

        return () => {
            console.log('🎨 CodingSymbolsAnimation unmounted')
            clearInterval(interval)
        }
    }, [])

    return (
        <>
            <style>{`
                ${symbols.map(symbol => `
                    @keyframes symbolFloat-${symbol.id} {
                        0% {
                            transform: translate(-50%, -50%) translate(${symbol.startX}%, ${symbol.startY}%) rotate(0deg) scale(0.3);
                            opacity: 0;
                        }
                        15% {
                            opacity: 1;
                            transform: translate(-50%, -50%) translate(${symbol.startX * 1.5}%, ${symbol.startY * 1.5}%) rotate(${symbol.rotation * 0.3}deg) scale(1);
                        }
                        25% {
                            transform: translate(-50%, -50%) translate(${symbol.startX * 2 + Math.sin(symbol.id) * 10}px, ${symbol.startY * 2}px) rotate(${symbol.rotation * 0.5}deg) scale(1.1);
                        }
                        40% {
                            transform: translate(-50%, -50%) translate(${symbol.endX * 0.4 + Math.cos(symbol.id) * 15}px, ${symbol.endY * 0.4}px) rotate(${symbol.rotation * 0.7}deg) scale(1);
                        }
                        55% {
                            transform: translate(-50%, -50%) translate(${symbol.endX * 0.6 + Math.sin(symbol.id * 2) * 10}px, ${symbol.endY * 0.6}px) rotate(${symbol.rotation * 0.85}deg) scale(0.95);
                        }
                        70% {
                            opacity: 0.8;
                            transform: translate(-50%, -50%) translate(${symbol.endX * 0.8}px, ${symbol.endY * 0.8}px) rotate(${symbol.rotation}deg) scale(0.85);
                        }
                        85% {
                            opacity: 0.4;
                        }
                        100% {
                            transform: translate(-50%, -50%) translate(${symbol.endX}px, ${symbol.endY}px) rotate(${symbol.rotation}deg) scale(0.5);
                            opacity: 0;
                        }
                    }
                `).join('\n')}
            `}</style>

            <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
                {symbols.map((symbol) => (
                    <div
                        key={symbol.id}
                        className="absolute top-1/2 left-1/2 text-3xl md:text-4xl font-bold select-none coding-symbol"
                        style={{
                            fontFamily: "'Courier New', 'Monaco', 'Consolas', monospace",
                            color: symbol.color,
                            textShadow: `0 0 8px ${symbol.color}80, 0 0 15px ${symbol.color}40`,
                            animation: `symbolFloat-${symbol.id} ${symbol.duration}s cubic-bezier(0.4, 0, 0.6, 1) forwards`,
                            willChange: "transform, opacity",
                            filter: "drop-shadow(0 0 3px currentColor)"
                        }}
                    >
                        {symbol.char}
                    </div>
                ))}
            </div>
        </>
    )
}
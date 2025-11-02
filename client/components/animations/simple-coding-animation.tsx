"use client"

import { useEffect, useState, useRef } from "react"

// ============================================
// 🎨 可调参数区域 - 自定义动画效果
// ============================================

// 🔤 符号库 - 添加或删除编程符号
const SYMBOLS = [
    "Java", "springboot", "MySQL", "HTML", "CSS", "JS", "TS", "React", "Node", "API", "JSON", "Python"
]

// 🎨 颜色方案 - 像素风格配色（修改符号颜色）
const COLORS = [
    "#FF006E",  // 粉红色 - 像素艺术风格
    "#8338EC",  // 紫色 - 复古游戏色
    "#3A86FF",  // 蓝色 - 经典像素蓝
    "#FFBE0B",  // 金黄色 - 像素金色
    "#FB5607"   // 橙红色 - 像素活力色
]

// ⏱️ 动画时长 - 符号从出现到消失的时间（秒）
const ANIMATION_DURATION_MIN = 2.0  // 最短时长
const ANIMATION_DURATION_MAX = 2.5  // 最长时长

// 🔢 符号数量 - 同时显示的最大符号数
const MAX_SYMBOLS = 12

// ⚡ 生成频率 - 多久产生一个新符号（毫秒）
const SPAWN_INTERVAL_MIN = 100  // 最短间隔（更快）
const SPAWN_INTERVAL_MAX = 200  // 最长间隔

// 📏 符号大小 - 字体尺寸（像素）- 像素字体适合较小尺寸
const SYMBOL_SIZE_MOBILE = 24   // 移动端：24px（像素字体最佳尺寸）
const SYMBOL_SIZE_DESKTOP = 32  // 桌面端：32px（像素字体最佳尺寸）

// 📍 移动距离 - 符号扩散的距离（像素）
const SPREAD_DISTANCE_MIN = 480  // 最短扩散距离
const SPREAD_DISTANCE_MAX = 480  // 最长扩散距离

// ============================================

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

export default function SimpleCodingAnimation() {
    const [symbols, setSymbols] = useState<Symbol[]>([])
    const nextIdRef = useRef(0)

    useEffect(() => {
        const createSymbol = (): Symbol => {
            const id = nextIdRef.current++

            // 起始位置：中心区域的随机偏移
            const startX = (Math.random() - 0.5) * 20
            const startY = (Math.random() - 0.5) * 20

            // 结束位置：向外辐射
            const angle = Math.random() * Math.PI * 2
            const distance = SPREAD_DISTANCE_MIN + Math.random() * (SPREAD_DISTANCE_MAX - SPREAD_DISTANCE_MIN)
            const endX = startX + Math.cos(angle) * distance
            const endY = startY + Math.sin(angle) * distance

            return {
                id,
                char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                startX,
                startY,
                endX,
                endY,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                duration: ANIMATION_DURATION_MIN + Math.random() * (ANIMATION_DURATION_MAX - ANIMATION_DURATION_MIN),
                rotation: (Math.random() - 0.5) * 60
            }
        }

        // 初始符号
        const initialSymbols: Symbol[] = []
        const initialCount = Math.floor(MAX_SYMBOLS * 0.6)
        for (let i = 0; i < initialCount; i++) {
            initialSymbols.push(createSymbol())
        }
        setSymbols(initialSymbols)

        // 周期性生成新符号
        const interval = setInterval(() => {
            setSymbols(prev => {
                const newSymbol = createSymbol()
                const updated = [...prev, newSymbol]
                return updated.slice(-MAX_SYMBOLS)
            })
        }, SPAWN_INTERVAL_MIN + Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN))

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {/* 🎬 流畅连续动画 - 快速淡入后持续移动并渐隐，无停顿 */}
            <style>{`
                ${symbols.map(symbol => `
                    @keyframes symbolFloat-${symbol.id} {
                        0% {
                            transform: translate(-50%, -50%) translate(0%, 0%) rotate(0deg) scale(0.5);
                            opacity: 0;
                        }
                        60% {
                            opacity: 1;
                        }
                        100% {
                            transform: translate(-50%, -50%) translate(${symbol.endX}px, ${symbol.endY}px) rotate(${symbol.rotation}deg) scale(0.8);
                            opacity: 0;
                        }
                    }
                `).join('\n')}
            `}</style>

            <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
                {symbols.map((symbol) => (
                    <div
                        key={symbol.id}
                        className="absolute top-1/2 left-1/2 font-bold select-none coding-symbol"
                        style={{
                            // 📏 响应式字体大小 - 根据屏幕调整
                            fontSize: `clamp(${SYMBOL_SIZE_MOBILE}px, 5vw, ${SYMBOL_SIZE_DESKTOP}px)`,
                            fontFamily: "'Press Start 2P', 'Courier New', 'Monaco', 'Consolas', monospace",
                            color: symbol.color,
                            // 🌟 像素风格发光效果 - 硬边缘光晕
                            textShadow: `
                                1px 1px 0px ${symbol.color}CC, 
                                1px 1px 0px ${symbol.color}88,
                                1px 1px 0px ${symbol.color}44
                            `,
                            // ⚙️ 缓动函数 - 使用自然的加速减速曲线，避免突变
                            animation: `symbolFloat-${symbol.id} ${symbol.duration}s ease-out forwards`,
                            willChange: "transform, opacity",
                            filter: `contrast(1.1) saturate(1.2)`,
                            fontWeight: 700,
                            imageRendering: "pixelated",
                            WebkitFontSmoothing: "none"
                        }}
                    >
                        {symbol.char}
                    </div>
                ))}
            </div>
        </>
    )
}

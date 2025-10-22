"use client"

import { useEffect, useState, useRef } from "react"

// ============================================
// 🎨 可调参数区域 - 自定义动画效果
// ============================================

// 🔤 符号库 - 添加或删除编程符号
const SYMBOLS = [
    "@", "#", "$", "%", "&", "*", "{", "}", "[", "]", "<", ">", "/", "\\",
    "string", "number", "boolean", "const", "let", "var", "function", "=>"
]

// 🎨 颜色方案 - 修改符号颜色（支持任意颜色代码）
const COLORS = [
    "#FF8C00",  // 橙色 - 呼应 Developer 主题
    "#00FF00",  // 亮绿色 - 经典编程色
    "#00FFFF"   // 青色 - 赛博朋克风格
]

// ⏱️ 动画时长 - 符号从出现到消失的时间（秒）
const ANIMATION_DURATION_MIN = 1.5  // 最短时长
const ANIMATION_DURATION_MAX = 2.5  // 最长时长

// 🔢 符号数量 - 同时显示的最大符号数
const MAX_SYMBOLS = 12

// ⚡ 生成频率 - 多久产生一个新符号（毫秒）
const SPAWN_INTERVAL_MIN = 50  // 最短间隔（更快）
const SPAWN_INTERVAL_MAX = 200  // 最长间隔

// 📏 符号大小 - 字体尺寸（像素）
const SYMBOL_SIZE_MOBILE = 48   // 移动端：48px
const SYMBOL_SIZE_DESKTOP = 60  // 桌面端：60px（已放大）

// 📍 移动距离 - 符号扩散的距离（像素）
const SPREAD_DISTANCE_MIN = 200  // 最短扩散距离
const SPREAD_DISTANCE_MAX = 320  // 最长扩散距离

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
            {/* 🎬 一段式流畅动画 - 从中心淡入扩散，最后淡出 */}
            <style>{`
                ${symbols.map(symbol => `
                    @keyframes symbolFloat-${symbol.id} {
                        0% {
                            transform: translate(-50%, -50%) translate(0%, 0%) rotate(0deg) scale(0.5);
                            opacity: 0;
                        }
                        20% {
                            opacity: 1;
                            transform: translate(-50%, -50%) translate(${symbol.endX * 0.2}px, ${symbol.endY * 0.2}px) rotate(${symbol.rotation * 0.4}deg) scale(1);
                        }
                        80% {
                            opacity: 0.9;
                            transform: translate(-50%, -50%) translate(${symbol.endX * 0.85}px, ${symbol.endY * 0.85}px) rotate(${symbol.rotation * 0.9}deg) scale(1);
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
                            fontFamily: "'Courier New', 'Monaco', 'Consolas', monospace",
                            color: symbol.color,
                            // 🌟 发光效果 - 三层光晕
                            textShadow: `
                                0 0 10px ${symbol.color}99, 
                                0 0 20px ${symbol.color}66,
                                0 0 30px ${symbol.color}33
                            `,
                            // ⚙️ 缓动函数 - 使用自然的加速减速曲线，避免突变
                            animation: `symbolFloat-${symbol.id} ${symbol.duration}s ease-out forwards`,
                            willChange: "transform, opacity",
                            filter: `drop-shadow(0 0 4px ${symbol.color})`,
                            fontWeight: 900
                        }}
                    >
                        {symbol.char}
                    </div>
                ))}
            </div>
        </>
    )
}

"use client"
import Link from "next/link";
import PhotoCarousel from "@/components/media/photo-carousel";
import Avatar from '@/components/layout/avatar'
import { Button } from "@/components/ui/button"
import TechStack from "@/components/ui/tech-stack";
import { useState, useRef } from "react";
import Tutongdetails from "@/components/media/tutong-details";
import { useSuccessDialog } from "@/components/dialogs/success-dialog";
import { Heart, Sparkles, Code2, Dog } from "lucide-react";
import { motion, useInView } from "framer-motion";

export default function Home() {
    const { showSuccess } = useSuccessDialog();
    const [detailOpen, setDetailOpen] = useState(false);

    // Refs for scroll animations - 三大模块
    const module1Ref = useRef(null);
    const module2Ref = useRef(null);
    const module3Ref = useRef(null);

    // InView hooks for each module
    const module1InView = useInView(module1Ref, { once: true, amount: 0.2 });
    const module2InView = useInView(module2Ref, { once: true, amount: 0.2 });
    const module3InView = useInView(module3Ref, { once: true, amount: 0.2 });

    // Animation variants - 苹果风格动画
    const fadeInUp = {
        hidden: { opacity: 0, y: 80 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                ease: [0.22, 1, 0.36, 1] as const // Apple-style easing
            }
        }
    } as const;

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 1.2,
                ease: "easeOut" as const
            }
        }
    } as const;

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.92 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    } as const;

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    } as const; return (
        <>
            {/* ==================== 模块 1: 首屏欢迎 + Photo Carousel ==================== */}
            <motion.section
                ref={module1Ref}
                initial="hidden"
                animate={module1InView ? "visible" : "hidden"}
                className="relative min-h-screen flex flex-col justify-center"
            >
                {/* Geometric Background Pattern */}
                <motion.div
                    variants={fadeIn}
                    className="absolute inset-0 -z-10"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20"></div>

                    {/* Animated Geometric shapes */}
                    <motion.div
                        initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
                        animate={module1InView ? { opacity: 0.3, rotate: 45, scale: 1 } : {}}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        className="absolute top-20 left-10 w-32 h-32 border-2 border-blue-200/30 rounded-3xl"
                    />
                    <motion.div
                        initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
                        animate={module1InView ? { opacity: 0.3, rotate: 12, scale: 1 } : {}}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="absolute top-40 right-20 w-24 h-24 border-2 border-purple-200/30 rounded-2xl"
                    />
                    <motion.div
                        initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
                        animate={module1InView ? { opacity: 0.3, rotate: -12, scale: 1 } : {}}
                        transition={{ duration: 1.5, delay: 0.7 }}
                        className="absolute bottom-40 left-1/4 w-20 h-20 border-2 border-indigo-200/30 rounded-xl"
                    />

                    {/* Paw prints decoration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                        animate={module1InView ? { opacity: 0.03, scale: 1, rotate: 12 } : {}}
                        transition={{ duration: 1.2, delay: 0.4 }}
                        className="absolute top-1/4 right-1/3"
                    >
                        <Dog className="w-24 h-24 text-gray-900" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                        animate={module1InView ? { opacity: 0.03, scale: 1, rotate: -45 } : {}}
                        transition={{ duration: 1.2, delay: 0.6 }}
                        className="absolute bottom-1/3 left-1/4"
                    >
                        <Dog className="w-32 h-32 text-gray-900" />
                    </motion.div>
                </motion.div>

                {/* Hero Content */}
                <div className="w-full px-4 md:px-20 2xl:px-60 py-16 md:py-24">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={module1InView ? "visible" : "hidden"}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="text-center space-y-6 mb-16">
                            <motion.div
                                variants={fadeInUp}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm"
                            >
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-medium text-gray-700">Welcome to Our World</span>
                            </motion.div>

                            <motion.h1
                                variants={fadeInUp}
                                className="text-4xl md:text-6xl 2xl:text-7xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent leading-tight"
                            >
                                Wang Beagle's Digital Space
                            </motion.h1>

                            <motion.p
                                variants={fadeInUp}
                                className="text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                            >
                                Just playing around here and with the cutest
                                <span className="font-semibold text-blue-600"> TutongBrothers</span>
                            </motion.p>
                        </div>
                    </motion.div>
                </div>

                {/* Photo Carousel Section */}
                <motion.div
                    variants={scaleIn}
                    initial="hidden"
                    animate={module1InView ? "visible" : "hidden"}
                    className="pb-20"
                >
                    <PhotoCarousel />
                </motion.div>
            </motion.section>

            {/* ==================== 模块 2: TutongBrothers 社交媒体 ==================== */}
            <motion.section
                ref={module2Ref}
                initial="hidden"
                animate={module2InView ? "visible" : "hidden"}
                className="relative min-h-screen flex items-center px-4 md:px-20 2xl:px-60 py-20 md:py-32"
            >
                {/* Background decorations */}
                <motion.div
                    variants={fadeIn}
                    className="absolute inset-0 -z-10"
                >
                    <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-10 w-56 h-56 bg-gradient-to-br from-pink-100/40 to-orange-100/40 rounded-full blur-3xl"></div>
                </motion.div>

                <div className="max-w-7xl mx-auto w-full">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={module2InView ? "visible" : "hidden"}
                    >
                        {/* Section Header */}
                        <div className="text-center mb-16 space-y-6">
                            <motion.div
                                variants={fadeInUp}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-full border border-pink-200/50"
                            >
                                <Heart className="w-4 h-4 text-pink-500" />
                                <span className="text-sm font-semibold text-gray-700">Social Media Presence</span>
                            </motion.div>

                            <motion.h2
                                variants={fadeInUp}
                                className="text-4xl md:text-5xl 2xl:text-6xl font-bold text-gray-900"
                            >
                                Meet the <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">TutongBrothers</span>
                            </motion.h2>

                            <motion.p
                                variants={fadeInUp}
                                className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
                            >
                                Pet bloggers with over <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">300,000+</span> followers spreading joy across the Internet
                            </motion.p>
                        </div>

                        {/* Cards Grid */}
                        <motion.div
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16"
                        >
                            {/* Max Card */}
                            <motion.div variants={scaleIn} className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
                                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                                    <Link href="https://weibo.com/u/5232941578" target="_blank" className="block">
                                        <div className="relative overflow-hidden rounded-xl mb-4">
                                            <img
                                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                                                src="/weibo/maxu.png"
                                                alt="Max"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-1">Max</h3>
                                                <p className="text-sm text-gray-500">@图桶宝贝</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Dog className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Edward Card */}
                            <motion.div variants={scaleIn} className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
                                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                                    <Link href="https://weibo.com/u/2193725294" target="_blank" className="block">
                                        <div className="relative overflow-hidden rounded-xl mb-4">
                                            <img
                                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                                                src="/weibo/wangbige.png"
                                                alt="Edward"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-1">Edward</h3>
                                                <p className="text-sm text-gray-500">@王比格与胡比格</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Dog className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* CTA Section */}
                        <motion.div variants={fadeInUp} className="text-center">
                            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/50">
                                <p className="text-lg font-medium text-gray-700">
                                    ✨ Discover their amazing journey
                                </p>
                                <Button
                                    onClick={() => setDetailOpen(true)}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                    size="lg"
                                >
                                    Learn More
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* ==================== 模块 3: 开发者介绍 ==================== */}
            <motion.section
                ref={module3Ref}
                initial="hidden"
                animate={module3InView ? "visible" : "hidden"}
                className="relative min-h-screen flex items-center px-4 md:px-20 2xl:px-60 py-20 md:py-32 bg-gradient-to-b from-white to-slate-50"
            >
                {/* Geometric Background Elements */}
                <motion.div
                    variants={fadeIn}
                    className="absolute inset-0 -z-10 overflow-hidden"
                >
                    <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl"></div>

                    {/* Code-themed geometric shapes */}
                    <motion.div
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={module3InView ? { opacity: 0.2, rotate: 45 } : {}}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        className="absolute top-20 right-1/4 w-16 h-16 border-2 border-blue-300/20"
                    />
                    <motion.div
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={module3InView ? { opacity: 0.2, rotate: -12 } : {}}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="absolute bottom-40 left-1/3 w-12 h-12 border-2 border-purple-300/20 rounded-lg"
                    />
                    <motion.div
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={module3InView ? { opacity: 0.3, rotate: 45 } : {}}
                        transition={{ duration: 1.5, delay: 0.7 }}
                        className="absolute top-1/2 left-1/4 w-8 h-8 bg-gradient-to-br from-blue-200/30 to-purple-200/30"
                    />
                </motion.div>

                <div className="max-w-7xl mx-auto w-full">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={module3InView ? "visible" : "hidden"}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    >
                        {/* Content Side */}
                        <div className="space-y-8">
                            {/* Badge */}
                            <motion.div
                                variants={fadeInUp}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-blue-200/50 shadow-sm"
                            >
                                <Code2 className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-semibold text-gray-700">Full-Stack Developer</span>
                            </motion.div>

                            {/* Heading */}
                            <motion.div variants={fadeInUp} className="space-y-4">
                                <h2 className="text-4xl md:text-5xl 2xl:text-6xl font-extrabold text-gray-900 leading-tight">
                                    Also, I'm a
                                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                                        Developer
                                    </span>
                                </h2>

                                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                                    A passionate full-stack developer specializing in
                                    <span className="font-semibold text-blue-600"> Java</span> backend development
                                    and modern front-end with
                                    <span className="font-semibold text-purple-600"> React</span>.
                                </p>
                            </motion.div>

                            {/* Tech Stack Section */}
                            <motion.div variants={fadeInUp} className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Tech Stack & Tools
                                </h3>
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                    <TechStack />
                                </div>
                            </motion.div>

                            {/* Stats/Features Grid */}
                            <motion.div
                                variants={staggerContainer}
                                className="grid grid-cols-2 gap-4 pt-4"
                            >
                                <motion.div
                                    variants={scaleIn}
                                    className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/30"
                                >
                                    <div className="text-2xl font-bold text-blue-600 mb-1">3+</div>
                                    <div className="text-sm text-gray-600">Years Experience</div>
                                </motion.div>
                                <motion.div
                                    variants={scaleIn}
                                    className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/30"
                                >
                                    <div className="text-2xl font-bold text-purple-600 mb-1">10+</div>
                                    <div className="text-sm text-gray-600">Projects Built</div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Avatar Side */}
                        <motion.div
                            variants={scaleIn}
                            className="relative flex justify-center lg:justify-end"
                        >
                            {/* Decorative elements */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-80 h-80 bg-gradient-to-br from-blue-200/20 via-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
                            </div>

                            {/* Avatar with enhanced styling */}
                            <div className="relative">
                                <motion.div
                                    animate={{
                                        opacity: [0.15, 0.25, 0.15],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl"
                                />
                                <div className="relative bg-white p-2 rounded-full shadow-2xl">
                                    <Avatar />
                                </div>

                                {/* Floating code elements */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20, rotate: 0 }}
                                    animate={module3InView ? { opacity: 1, y: 0, rotate: 12 } : {}}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-100 hover:rotate-0 transition-transform duration-300"
                                >
                                    <Code2 className="w-8 h-8 text-blue-600" />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20, rotate: 0 }}
                                    animate={module3InView ? { opacity: 1, y: 0, rotate: -12 } : {}}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    className="absolute -bottom-6 -left-6 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-100 hover:rotate-0 transition-transform duration-300"
                                >
                                    <Dog className="w-8 h-8 text-purple-600" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Tutong Details Modal */}
            {detailOpen && (
                <Tutongdetails onClose={() => setDetailOpen(false)} />
            )}
        </>
    );
}

"use client"
import Link from "next/link";
import Image from "next/image";
import PhotoCarousel from "@/components/media/photo-carousel";
import Avatar from '@/components/layout/avatar'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TechStack from "@/components/ui/tech-stack";
import { useState, useRef } from "react";
import Tutongdetails from "@/components/media/tutong-details";
import PhotoManager from "@/components/admin/photo-manager";

import SimpleCodingAnimation from "@/components/animations/simple-coding-animation";
import { Heart, Sparkles, Code2, Dog, Users, ImageIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
    const [detailOpen, setDetailOpen] = useState(false);
    const [photoManagerOpen, setPhotoManagerOpen] = useState(false);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

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
            {/* ==================== Hero Section - Beagle Design ==================== */}
            <motion.section
                ref={module1Ref}
                initial="hidden"
                animate={module1InView ? "visible" : "hidden"}
                className="relative min-h-screen flex flex-col justify-center py-10 overflow-hidden"
            >
                {/* Decorative Paw Prints - Organic Elements */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
                    <div className="absolute top-[10%] right-[15%] text-[5rem] transform -rotate-12">🐾</div>
                    <div className="absolute top-[30%] right-[5%] text-[4rem] transform rotate-[25deg]">🐾</div>
                    <div className="absolute bottom-[20%] right-[20%] text-[6rem] transform -rotate-[30deg]">🐾</div>
                </div>

                {/* Main Content Container */}
                <div className="max-w-beagle mx-auto px-4 sm:px-6 md:px-8 w-full overflow-hidden">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={module1InView ? "visible" : "hidden"}
                        className="grid lg:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 lg:gap-16 items-center w-full"
                    >
                        {/* Left: Hero Content */}
                        <div className="space-y-8">
                            <motion.div variants={fadeInUp}>
                                <Badge variant="default" className="mb-4">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Welcome to Our World
                                </Badge>
                            </motion.div>

                            <motion.h1
                                variants={fadeInUp}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-forest-green leading-tight break-words"
                            >
                                Wang Beagle's
                                <span className="text-gradient-orange block mt-2">
                                    Digital Space
                                </span>
                            </motion.h1>

                            <motion.p
                                variants={fadeInUp}
                                className="text-base sm:text-lg md:text-xl lg:text-2xl text-medium-text leading-relaxed break-words"
                            >
                                Just playing around here with the cutest{" "}
                                <span className="font-bold text-warm-orange">TutongBrothers</span>
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                                <Link href="/blog">
                                    <Button variant="accent" size="lg">
                                        Explore Blogs
                                    </Button>
                                </Link>
                                <Button onClick={() => setDetailOpen(true)} variant="outline" size="lg">
                                    Learn More
                                </Button>
                            </motion.div>
                        </div>

                        {/* Right: Photo Carousel in Beautiful Card */}
                        <motion.div variants={scaleIn} className="relative w-full max-w-full overflow-hidden">
                            <div className="rounded-beagle-xl shadow-beagle-xl overflow-hidden w-full max-w-full">
                                <PhotoCarousel />
                            </div>
                            {/* Admin: Manage Photos Button */}
                            {isAdmin && (
                                <motion.div
                                    variants={fadeInUp}
                                    className="mt-4 flex justify-center"
                                >
                                    <Button
                                        onClick={() => setPhotoManagerOpen(true)}
                                        variant="secondary"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                        manage photos
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* ==================== TutongBrothers Section - Beagle Design ==================== */}
            <motion.section
                ref={module2Ref}
                initial="hidden"
                animate={module2InView ? "visible" : "hidden"}
                className="py-section-lg mb-10"
            >
                <div className="max-w-beagle mx-auto px-4 sm:px-6 md:px-8">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={module2InView ? "visible" : "hidden"}
                    >
                        {/* Section Header */}
                        <div className="text-center mb-16 space-y-6">
                            <motion.div variants={fadeInUp}>
                                <Badge variant="default" className="mb-4">
                                    <Heart className="w-4 h-4 mr-2" />
                                    Social Media Stars
                                </Badge>
                            </motion.div>

                            <motion.h2
                                variants={fadeInUp}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-forest-green break-words"
                            >
                                Meet the{" "}
                                <span className="text-gradient-orange">TutongBrothers</span>
                            </motion.h2>

                            <motion.p
                                variants={fadeInUp}
                                className="text-base sm:text-lg md:text-xl lg:text-2xl text-medium-text max-w-3xl mx-auto leading-relaxed break-words px-4"
                            >
                                Pet bloggers with over{" "}
                                <span className="font-bold text-warm-orange">300,000+</span>{" "}
                                followers spreading joy across the Internet
                            </motion.p>
                        </div>

                        {/* Cards Grid */}
                        <motion.div
                            variants={staggerContainer}
                            className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12"
                        >
                            {/* Max Card */}
                            <motion.div variants={scaleIn}>
                                <Link
                                    href="https://weibo.com/u/5232941578"
                                    target="_blank"
                                    className="block bg-white rounded-beagle-xl overflow-hidden shadow-beagle-lg hover:-translate-y-2 hover:shadow-beagle-xl transition-all duration-300 group"
                                >
                                    <div className="relative overflow-hidden bg-light-beige/30">
                                        <Image
                                            className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
                                            src="https://res.cloudinary.com/dewxaup4t/image/upload/v1761118395/maxu_m8oz2a.png"
                                            alt="Max"
                                            width={600}
                                            height={400}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                                            quality={85}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-4 sm:p-6 md:p-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-2xl sm:text-3xl font-extrabold text-forest-green mb-1">Max</h3>
                                                <p className="text-medium-text text-base sm:text-lg break-words">@图桶宝贝</p>
                                            </div>
                                            <Badge variant="secondary">
                                                <Users className="w-3 h-3 mr-1" />
                                                300K
                                            </Badge>
                                        </div>
                                        <p className="text-medium-text text-base sm:text-lg leading-relaxed break-words">
                                            "Recording the family of 3 beagles daily life❤(one beagle, one dachshund beagle, and one human beagle)"
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>

                            {/* Edward Card */}
                            <motion.div variants={scaleIn}>
                                <Link
                                    href="https://weibo.com/u/2193725294"
                                    target="_blank"
                                    className="block bg-white rounded-beagle-xl overflow-hidden shadow-beagle-lg hover:-translate-y-2 hover:shadow-beagle-xl transition-all duration-300 group"
                                >
                                    <div className="relative overflow-hidden bg-light-beige/30">
                                        <Image
                                            className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
                                            src="https://res.cloudinary.com/dewxaup4t/image/upload/v1761118395/wangbige_jfxtea.png"
                                            alt="Edward"
                                            width={600}
                                            height={400}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                                            quality={85}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-4 sm:p-6 md:p-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-2xl sm:text-3xl font-extrabold text-forest-green mb-1">Edward</h3>
                                                <p className="text-medium-text text-base sm:text-lg break-words">@王比格与胡比格</p>
                                            </div>
                                            <Badge variant="secondary">
                                                <Users className="w-3 h-3 mr-1" />
                                                60K
                                            </Badge>
                                        </div>
                                        <p className="text-medium-text text-base sm:text-lg leading-relaxed break-words">
                                            Beagle sexy photographer capturing the secret of beagle life 📸 and the sexy moment of Tutongbrothers(laugh)
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* CTA Card */}
                        {/* <motion.div variants={fadeInUp} className="text-center">
                            <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 bg-white rounded-beagle-xl shadow-beagle-lg border-2 border-light-beige">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center shadow-orange">
                                        <Sparkles className="w-7 h-7 text-white" />
                                    </div>
                                    <p className="text-xl font-bold text-forest-green">
                                        Discover their amazing journey
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setDetailOpen(true)}
                                    variant="accent"
                                    size="lg"
                                >
                                    Learn More
                                </Button>
                            </div>
                        </motion.div> */}
                    </motion.div>
                </div>
            </motion.section>

            {/* ==================== Developer Section - Dark Beagle Theme ==================== */}
            <motion.section
                ref={module3Ref}
                initial="hidden"
                animate={module3InView ? "visible" : "hidden"}
                className="py-section-lg bg-gradient-dark relative overflow-hidden"
            >
                {/* Large Decorative Paw Print */}
                <div className="absolute right-[-50px] bottom-[-50px] text-[20rem] opacity-5 pointer-events-none transform -rotate-[15deg]">
                    🐾
                </div>

                <div className="max-w-beagle mx-auto px-4 sm:px-6 md:px-8 py-10">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={module3InView ? "visible" : "hidden"}
                        className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center"
                    >
                        {/* Left: Content */}
                        <div className="space-y-8">
                            <motion.div variants={fadeInUp}>
                                <Badge variant="default" className="my-8">
                                    <Code2 className="w-4 h-4 mr-2" />
                                    Full-Stack Developer
                                </Badge>
                            </motion.div>

                            <motion.h2
                                variants={fadeInUp}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-cream leading-tight break-words"
                            >
                                Also, I'm a
                                <span className="text-gradient-orange block mt-2">
                                    Developer
                                </span>
                            </motion.h2>

                            <motion.p
                                variants={fadeInUp}
                                className="text-base sm:text-lg md:text-xl lg:text-2xl text-light-beige/90 leading-relaxed break-words"
                            >
                                A passionate full-stack developer specializing in{" "}
                                <span className="font-bold text-warm-orange">Java</span> backend
                                and modern front-end with{" "}
                                <span className="font-bold text-orange">React</span>.
                            </motion.p>

                            {/* Tech Stack Card */}
                            <motion.div variants={fadeInUp}>
                                <h3 className="text-sm font-semibold text-cream/80 uppercase tracking-wider mb-4">
                                    Tech Stack & Tools
                                </h3>

                                <div className="glass rounded-beagle-lg p-6 border border-white/20 shadow-beagle-lg">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                        {/* Tech Stack Button */}
                                        <div className="shrink-0">
                                            <TechStack />
                                        </div>

                                        {/* Description */}
                                        <div className="flex-1">
                                            <p className="text-[#344F1F] text-base leading-relaxed flex flex-wrap items-center gap-x-1">
                                                This blog is powered by{" "}
                                                <span className="font-bold text-[#F69221] flex items-center gap-1 whitespace-nowrap">
                                                    React
                                                    <img className="h-4 w-auto inline-block" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="react" />
                                                </span>
                                                ,{" "}
                                                <span className="font-bold text-[#F69221] flex items-center gap-1 whitespace-nowrap">
                                                    Next.js
                                                    <img className="h-4 w-auto inline-block" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" alt="nextjs" />
                                                </span>
                                                ,{" "}
                                                <span className="font-bold text-[#F69221] flex items-center gap-1 whitespace-nowrap">
                                                    Node.js
                                                    <img className="h-4 w-auto inline-block" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" />
                                                </span>
                                                ,{" "}
                                                <span className="font-bold text-[#F69221] flex items-center gap-1 whitespace-nowrap">
                                                    MongoDB
                                                    <img className="h-4 w-auto inline-block" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" alt="mongodb" />
                                                </span>
                                                , and{" "}
                                                <span className="font-bold text-[#F69221] flex items-center gap-1 whitespace-nowrap">
                                                    Tailwind CSS
                                                    <img className="h-4 w-auto inline-block" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="tailwind" />
                                                </span>
                                                , deployed on{" "}
                                                <span className="font-bold text-[#F69221] whitespace-nowrap">Vercel ▲</span> and  <span className="font-bold text-[#F69221] whitespace-nowrap">Render.</span>
                                            </p>

                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Stats Grid */}
                            <motion.div
                                variants={staggerContainer}
                                className="grid grid-cols-2 gap-4"
                            >
                                <motion.div variants={scaleIn}>
                                    <div className="glass p-6 border border-white/20 hover:-translate-y-1 transition-transform duration-300">
                                        <div className="text-4xl font-black text-warm-orange mb-2">3+</div>
                                        <div className="text-base text-forest-green font-medium">Years Experience</div>
                                    </div>
                                </motion.div>
                                <motion.div variants={scaleIn}>
                                    <div className="glass p-6 border border-white/20 hover:-translate-y-1 transition-transform duration-300">
                                        <div className="text-4xl font-black text-orange mb-2">20+</div>
                                        <div className="text-base text-forest-green font-medium">Projects Built</div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Right: Avatar with decorative elements */}
                        <motion.div variants={scaleIn} className="relative flex justify-center overflow-visible">
                            {/* Glow effect */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-96 h-96 bg-warm-orange/20 rounded-full blur-3xl"></div>
                            </div>

                            {/* Coding Symbols Animation - Behind card */}
                            <div className="absolute inset-0 w-full h-full">
                                <SimpleCodingAnimation />
                                {/* <CodingSymbolsAnimation /> */}
                            </div>

                            {/* Avatar Card */}
                            <div className="relative z-10">
                                <div className="bg-cream rounded-xl p-3 shadow-beagle-xl">
                                    <Avatar />
                                </div>

                                {/* Floating icons with Beagle style */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20, rotate: 12 }}
                                    animate={module3InView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="absolute -top-6 -right-6 w-16 h-16 bg-white    shadow-orange flex items-center justify-center hover:scale-110 transition-transform rounded-xl"
                                >
                                    <Code2 className="w-8 h-8 text-warm-orange" />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20, rotate: -12 }}
                                    animate={module3InView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="absolute -bottom-6 -left-6 w-16 h-16 bg-white    shadow-orange flex items-center justify-center hover:scale-110 transition-transform rounded-xl"
                                >
                                    <Dog className="w-8 h-8 text-orange" />
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

            {/* Photo Manager Modal (Admin Only) */}
            {photoManagerOpen && (
                <PhotoManager onClose={() => setPhotoManagerOpen(false)} />
            )}
        </>
    );
}

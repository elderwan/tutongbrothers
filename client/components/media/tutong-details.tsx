import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"


type TutongdetailsProps = {
    onClose: () => void;
};

const Tutongdetails = ({ onClose }: TutongdetailsProps) => {
    // 禁止外部滚动
    useEffect(() => {
        // 保存原始的 overflow 样式
        const originalStyle = window.getComputedStyle(document.body).overflow;
        // 禁止 body 滚动
        document.body.style.overflow = 'hidden';

        // 组件卸载时恢复滚动
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    return (
        // 背景虚化层
        <div
            className="fixed inset-0 bg-transparent bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-md transition-all duration-300 ease-in-out"
            onClick={onClose}
        >
            {/* 主内容框 */}
            <div
                className="bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden px-2 md:px-8 2xl:px-16 py-5 mx-4 w-full max-w-5xl border border-gray-100 transform transition-all duration-300 ease-out scale-100 animate-in fade-in-0 zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 头部标题和关闭按钮 */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">TuTongbrothers</h1>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        aria-label="关闭详情"
                    >
                        <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                {/* 可滚动内容区域 - 自定义滚动条 */}
                <ScrollArea className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(85vh - 120px)' }}>
                    {/* 第一条内容 - 左图右文 */}
                    <div className="mb-10">
                        <div className="flex flex-col lg:flex-row gap-8 bg-[#fffeee]  rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                            {/* 左侧图片容器 */}
                            <div className="lg:w-1/3 relative group">
                                <div className="relative overflow-hidden rounded-xl shadow-lg">
                                    <img
                                        src="https://res.cloudinary.com/dewxaup4t/image/upload/v1761116439/huyitong_cemqp7.jpg"
                                        alt="huyitong"
                                        className="w-full h-72 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                </div>
                            </div>

                            {/* Right side content */}
                            <div className="lg:w-2/3 flex flex-col justify-start space-y-4 ">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                                    Hu yitong
                                </h2>
                                <p className="text-gray-700 leading-relaxed text-base">
                                    Hu Yitong is a lovely beagle boy, for now already 6 years old. He is a experimental beagle, from Huaxi lab. Before he came to our family, he had experienced a lot. But he is very brave and optimistic, and always brings joy and laughter to our family and friends on Weibo with his cute appearance and lively personality. Hu Yitong loves to play and stole something to eat even shit from him self, and is very good at making friends with other dogs(barking at the dogs that he hated). He is also very obedient and well-behaved, always listening to the commands of his owner(sometimes).
                                </p>
                                {/* <div className="flex items-center space-x-2 text-sm text-blue-600">
                                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                                    <span>200k+ followers</span>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center justify-center mb-10">
                        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        <div className="px-4">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    </div>

                    {/* Second content - Right image, left text */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row-reverse gap-8 bg-gradient-to-l from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                            {/* Right side image container */}
                            <div className="lg:w-1/3 relative group">
                                <div className="relative overflow-hidden rounded-xl shadow-lg">
                                    <img
                                        src="https://res.cloudinary.com/dewxaup4t/image/upload/v1761116438/hututu_vmek7h.jpg"
                                        alt="hututu"
                                        className="w-full h-72 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                </div>
                            </div>

                            {/* Left side content */}
                            <div className="lg:w-2/3 flex flex-col justify-start space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                                    Hu tutu
                                </h2>
                                <p className="text-gray-700 leading-relaxed text-base">
                                    Hu Tutu is a cute dachshund, 6 years old, from Dayi town, Chengdu city. Comparing with Hu Yitong, he is so lucky. He was adopted by our family when he was just 2 months old. Since then, he has been living a happy and carefree life with us. Hu Tutu is very lively and clever, always full of curiosity about the world around him. He loves to explore new places and meet new friends(sometimes, he prefer to play with himself). He is also very affectionate and loves to cuddle with his owner(sometimes he will bite you when he is too excited). Hu Tutu often brings us endless joy and laughter with his adorable antics and charming personality.
                                </p>
                                {/* <div className="flex items-center space-x-2 text-sm text-amber-600">
                                    <span className="inline-block w-2 h-2 bg-amber-400 rounded-full"></span>
                                    <span>特长：卖萌撒娇</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </ScrollArea >
            </div>
        </div>
    )
}

export default Tutongdetails
import React from 'react'


const footer = () => {
    return (
        <footer className="flex justify-center items-center max-w-6xl bg-white 
         shadow-2xl dark:bg-gray-900 mx-auto font-mono m-4 w-full">
            {/* Container centered with max width limitation */}
            <div className="mx-auto p-4 md:py-5 font-mono">
                <span className="block whitespace-nowrap text-gray-500 dark:text-gray-400 font-mono text-[10px] sm:text-sm md:text-base ">
                    © 2025{" "}
                    <a href="https://weibo.com/u/2193725294" target="_blank" className="hover:underline">
                        Beagle Wang
                    </a>{" "}
                    &{" "}
                    <a href="https://weibo.com/u/5232941578" target="_blank" className="hover:underline">
                        TutongBrothers
                    </a>
                    . All Rights Reserved.
                </span>

            </div>
        </footer>

    )
}

export default footer
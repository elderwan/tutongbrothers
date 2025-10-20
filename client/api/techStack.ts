import { BASE_URL } from "@/next.config";
import { ApiResponse } from "@/lib/Response";
import { api } from "@/lib/ApiFetch";

// 定义技术栈类型
export interface TechItem {
    _id?: string;
    label: string;
    imgLink: string;
    link: string;
}

export interface TechCategory {
    _id?: string;
    category: string;
    items: TechItem[];
}

// 获取技术栈数据
export async function getTechStack(): Promise<ApiResponse<TechCategory[]>> {
    try {
        return await api.get(`${BASE_URL}/tech-stack`);
    } catch (error) {
        console.error("Failed to fetch tech stack:", error);
        // 如果API调用失败，返回默认数据
        const defaultData: TechCategory[] = [
            {
                category: "frontend",
                items: [
                    { label: "Html", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg", link: "https://html.com/" },
                    { label: "React", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", link: "https://react.dev" },
                    { label: "Next.js", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", link: "https://nextjs.org" },
                    { label: "TypeScript", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", link: "https://www.typescriptlang.org" },
                    { label: "javaScript", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", link: "https://www.javascript.com/" },
                    { label: "Tailwind", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", link: "https://tailwindcss.com" },
                ]
            },
            {
                category: "backend",
                items: [
                    { label: "Node.js", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg", link: "https://nodejs.org" },
                    { label: "Express", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", link: "https://expressjs.com" },
                    { label: "JAVA", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original-wordmark.svg", link: "https://www.java.com/" },
                    { label: "SpringBoot", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg", link: "https://spring.io/projects/spring-boot" },
                ]
            },
            {
                category: "database",
                items: [
                    { label: "MongoDB", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg", link: "https://mongodb.com" },
                    { label: "MySQL", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg", link: "https://www.mysql.com/" },
                    { label: "Redis", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg", link: "https://redis.io/" },
                ]
            },
            {
                category: "server",
                items: [
                    { label: "Jenkins", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg", link: "https://www.jenkins.io/" },
                    { label: "Portainer", imgLink: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/portainer/portainer-original.svg", link: "https://www.portainer.io/" },
                ]
            },
        ];

        return {
            code: 200,
            msg: "Success",
            data: defaultData
        };
    }
}
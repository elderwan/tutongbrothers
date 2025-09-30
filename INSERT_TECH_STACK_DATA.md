# MongoDB 技术栈数据插入指南

## 1. 连接到MongoDB

首先连接到您的MongoDB实例：

```bash
mongo
```

或者如果使用MongoDB Atlas：

```bash
mongo "mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
```

## 2. 选择数据库

```javascript
use tutongbrothers
```

## 3. 清空现有数据（可选）

```javascript
db.techstacks.deleteMany({})
```

## 4. 插入技术栈数据

### 前端技术栈

```javascript
db.techstacks.insertOne({
  "category": "frontend",
  "items": [
    { 
      "label": "Html", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg", 
      "link": "https://html.com/" 
    },
    { 
      "label": "React", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", 
      "link": "https://react.dev" 
    },
    { 
      "label": "Next.js", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", 
      "link": "https://nextjs.org" 
    },
    { 
      "label": "TypeScript", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", 
      "link": "https://www.typescriptlang.org" 
    },
    { 
      "label": "javaScript", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", 
      "link": "https://www.javascript.com/" 
    },
    { 
      "label": "Tailwind", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", 
      "link": "https://tailwindcss.com" 
    }
  ]
})
```

### 后端技术栈

```javascript
db.techstacks.insertOne({
  "category": "backend",
  "items": [
    { 
      "label": "Node.js", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg", 
      "link": "https://nodejs.org" 
    },
    { 
      "label": "Express", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", 
      "link": "https://expressjs.com" 
    },
    { 
      "label": "JAVA", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original-wordmark.svg", 
      "link": "https://www.java.com/" 
    },
    { 
      "label": "SpringBoot", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg", 
      "link": "https://spring.io/projects/spring-boot" 
    }
  ]
})
```

### 数据库技术栈

```javascript
db.techstacks.insertOne({
  "category": "database",
  "items": [
    { 
      "label": "MongoDB", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg", 
      "link": "https://mongodb.com" 
    },
    { 
      "label": "MySQL", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg", 
      "link": "https://www.mysql.com/" 
    },
    { 
      "label": "Redis", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg", 
      "link": "https://redis.io/" 
    }
  ]
})
```

### 服务器技术栈

```javascript
db.techstacks.insertOne({
  "category": "server",
  "items": [
    { 
      "label": "Jenkins", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg", 
      "link": "https://www.jenkins.io/" 
    },
    { 
      "label": "Portainer", 
      "imgLink": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/portainer/portainer-original.svg", 
      "link": "https://www.portainer.io/" 
    }
  ]
})
```

## 5. 验证数据插入

```javascript
db.techstacks.find().pretty()
```
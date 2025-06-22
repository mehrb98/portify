import { IProjectCard } from "../types/project";

export const projects: IProjectCard[] = [
    {
        id: "1",
        image: "images/projects/1.png",
        title: "Portfolio",
        description: "Developed a sophisticated trading bot using machine learning algorithms to analyze market patterns and execute automated trades with risk management strategies.",
        date: "Mai 2025",
        images_src: "images/projects/1.png",
        techs: [
            { name: "React", icon: "FaReact" as const, color: "#61DAFB" },
            { name: "Next.js", icon: "SiNextdotjs" as const, color: "000000" },
            { name: "Tailwind", icon: "SiTailwindcss" as const, color: "06B6D4" },
            { name: "Typescript", icon: "SiTypescript" as const, color: "#06B6D4" },
        ],
        links: [
            { title: "Live Demo", url: "https://portify-mb.vercel.app" },
            { title: "GitHub", url: "https://github.com/mehrb98/portify/tree/main/portfolio_frontend/portify" },
        ],

        full_description:
            '## Problem\n\n' +
            'Traditional trading strategies often struggle to adapt to the rapidly evolving cryptocurrency markets, resulting in missed opportunities and potential losses. Manual trading approaches are limited by human reaction times and emotional biases, while existing automated solutions lack the sophistication to handle market complexity.\n\n' +
            'The challenge was further compounded by the need to process vast amounts of market data in real-time, manage risk effectively across multiple trading pairs, and maintain consistent performance during high-volatility periods.\n\n' +
            '## Action\n\n' +
            'Developed a sophisticated trading bot utilizing Python and TensorFlow to implement deep learning models. The system architecture was designed to process market data through multiple specialized neural networks, each focused on different aspects of market analysis - from price action and volume patterns to sentiment analysis of social media feeds.\n\n' +
            'Implemented advanced risk management algorithms that dynamically adjust position sizes and leverage based on market conditions and portfolio performance. Deployed the system on AWS using Docker containers for consistent performance, with automated failover and scaling capabilities to handle varying market conditions.\n\n' +
            '## Results\n\n' +
            'The trading bot has demonstrated exceptional performance across multiple metrics:\n\n' +
            '- 40% improvement in trade execution speed compared to previous systems\n' +
            '- 60% reduction in false trading signals through advanced filtering algorithms\n' +
            '- Maintained consistent profit margins even during high market volatility\n' +
            '- Successfully processes over 1 million market data points daily\n' +
            '- Sub-second response times for market condition changes\n' +
            '- 99.99% system uptime through robust infrastructure design',
    },
    {
        id: "2",
        image: "images/projects/1.png",
        title: "Roomify",
        description: "Developed a sophisticated trading bot using machine learning algorithms to analyze market patterns and execute automated trades with risk management strategies.",
        date: 'April 2025',
        images_src: "images/projects/1.png",
        techs: [
            { name: "React", icon: "FaReact" as const, color: "#61DAFB" },
            { name: "Next.js", icon: "SiNextdotjs" as const, color: "000000" },
            { name: "Tailwind", icon: "SiTailwindcss" as const, color: "06B6D4" },
            { name: "Typescript", icon: "SiTypescript" as const, color: "#06B6D4" },
            { name: "Google Cloud", icon: "SiGooglecloud" as const, color: "#4285F4" },
            { name: "JWT", icon: "SiJsonwebtokens" as const, color: "#A91E50" },
        ],
        links: [
            { title: "Live Demo", url: 'https://trading-bot.demo' },
            { title: "GitHub", url: 'https://github.com/username/trading-bot' },
        ],

        full_description:
            '## Problem\n\n' +
            'Traditional trading strategies often struggle to adapt to the rapidly evolving cryptocurrency markets, resulting in missed opportunities and potential losses. Manual trading approaches are limited by human reaction times and emotional biases, while existing automated solutions lack the sophistication to handle market complexity.\n\n' +
            'The challenge was further compounded by the need to process vast amounts of market data in real-time, manage risk effectively across multiple trading pairs, and maintain consistent performance during high-volatility periods.\n\n' +
            '## Action\n\n' +
            'Developed a sophisticated trading bot utilizing Python and TensorFlow to implement deep learning models. The system architecture was designed to process market data through multiple specialized neural networks, each focused on different aspects of market analysis - from price action and volume patterns to sentiment analysis of social media feeds.\n\n' +
            'Implemented advanced risk management algorithms that dynamically adjust position sizes and leverage based on market conditions and portfolio performance. Deployed the system on AWS using Docker containers for consistent performance, with automated failover and scaling capabilities to handle varying market conditions.\n\n' +
            '## Results\n\n' +
            'The trading bot has demonstrated exceptional performance across multiple metrics:\n\n' +
            '- 40% improvement in trade execution speed compared to previous systems\n' +
            '- 60% reduction in false trading signals through advanced filtering algorithms\n' +
            '- Maintained consistent profit margins even during high market volatility\n' +
            '- Successfully processes over 1 million market data points daily\n' +
            '- Sub-second response times for market condition changes\n' +
            '- 99.99% system uptime through robust infrastructure design',
    },
    {
        id: "3",
        image: "images/projects/1.png",
        title: "VfB Stuttgart - E-commerce Platform",
        description: "Developed a sophisticated trading bot using machine learning algorithms to analyze market patterns and execute automated trades with risk management strategies.",
        date: "October 2024 - April 2025",
        images_src: "images/projects/1.png",
        techs: [
            { name: "React", icon: "FaReact" as const, color: "#61DAFB" },
            { name: "Next.js", icon: "SiNextdotjs" as const, color: "#000000" },
            { name: "Tailwind", icon: "SiTailwindcss" as const, color: "#06B6D4" },
            { name: "Typescript", icon: "SiTypescript" as const, color: "#06B6D4" },
            { name: "Storybook", icon: "SiStorybook" as const, color: "#FF4785" }, 
            { name: "PimCore", icon: "SiPimcore" as const, color: "#06B6D4" },
            { name: "PHP", icon: "SiPhp" as const, color: "#777BB4" },      
            { name: "Mysql", icon: "SiMysql" as const, color: "#FFFFF" },      
            { name: "Docker", icon: "FaDocker" as const, color: "#06B6D4" },             
        ],
        links: [
            { title: 'Live Demo', url: 'https://trading-bot.demo' },
            { title: 'GitHub', url: 'https://github.com/username/trading-bot' },
        ],

        full_description:
            '## Problem\n\n' +
            'Traditional trading strategies often struggle to adapt to the rapidly evolving cryptocurrency markets, resulting in missed opportunities and potential losses. Manual trading approaches are limited by human reaction times and emotional biases, while existing automated solutions lack the sophistication to handle market complexity.\n\n' +
            'The challenge was further compounded by the need to process vast amounts of market data in real-time, manage risk effectively across multiple trading pairs, and maintain consistent performance during high-volatility periods.\n\n' +
            '## Action\n\n' +
            'Developed a sophisticated trading bot utilizing Python and TensorFlow to implement deep learning models. The system architecture was designed to process market data through multiple specialized neural networks, each focused on different aspects of market analysis - from price action and volume patterns to sentiment analysis of social media feeds.\n\n' +
            'Implemented advanced risk management algorithms that dynamically adjust position sizes and leverage based on market conditions and portfolio performance. Deployed the system on AWS using Docker containers for consistent performance, with automated failover and scaling capabilities to handle varying market conditions.\n\n' +
            '## Results\n\n' +
            'The trading bot has demonstrated exceptional performance across multiple metrics:\n\n' +
            '- 40% improvement in trade execution speed compared to previous systems\n' +
            '- 60% reduction in false trading signals through advanced filtering algorithms\n' +
            '- Maintained consistent profit margins even during high market volatility\n' +
            '- Successfully processes over 1 million market data points daily\n' +
            '- Sub-second response times for market condition changes\n' +
            '- 99.99% system uptime through robust infrastructure design',
    },
    {
        id: "4",
        image: "images/projects/1.png",
        title: "Topmotive - FileUploader",
        description: "Developed a sophisticated trading bot using machine learning algorithms to analyze market patterns and execute automated trades with risk management strategies.",
        date: 'December 2023',
        images_src: "images/projects/1.png",
        techs: [
            { name: "React", icon: "FaReact" as const, color: "#61DAFB" },
            { name: "Next.js", icon: "SiNextdotjs" as const, color: "000000" },
            { name: "Tailwind", icon: "SiTailwindcss" as const, color: "06B6D4" },
            { name: "Typescript", icon: "SiTypescript" as const, color: "#06B6D4" },
            { name: "Javascript", icon: "SiJavascript" as const, color: "#F7DF1E" },
        ],
        links: [
            { title: 'Live Demo', url: 'https://trading-bot.demo' },
            { title: 'GitHub', url: 'https://github.com/username/trading-bot' },
        ],

        full_description:
            '## Problem\n\n' +
            'Traditional trading strategies often struggle to adapt to the rapidly evolving cryptocurrency markets, resulting in missed opportunities and potential losses. Manual trading approaches are limited by human reaction times and emotional biases, while existing automated solutions lack the sophistication to handle market complexity.\n\n' +
            'The challenge was further compounded by the need to process vast amounts of market data in real-time, manage risk effectively across multiple trading pairs, and maintain consistent performance during high-volatility periods.\n\n' +
            '## Action\n\n' +
            'Developed a sophisticated trading bot utilizing Python and TensorFlow to implement deep learning models. The system architecture was designed to process market data through multiple specialized neural networks, each focused on different aspects of market analysis - from price action and volume patterns to sentiment analysis of social media feeds.\n\n' +
            'Implemented advanced risk management algorithms that dynamically adjust position sizes and leverage based on market conditions and portfolio performance. Deployed the system on AWS using Docker containers for consistent performance, with automated failover and scaling capabilities to handle varying market conditions.\n\n' +
            '## Results\n\n' +
            'The trading bot has demonstrated exceptional performance across multiple metrics:\n\n' +
            '- 40% improvement in trade execution speed compared to previous systems\n' +
            '- 60% reduction in false trading signals through advanced filtering algorithms\n' +
            '- Maintained consistent profit margins even during high market volatility\n' +
            '- Successfully processes over 1 million market data points daily\n' +
            '- Sub-second response times for market condition changes\n' +
            '- 99.99% system uptime through robust infrastructure design',
    },
    {
        id: "5",
        image: "images/projects/1.png",
        title: "Chat Application",
        description: "Developed a sophisticated trading bot using machine learning algorithms to analyze market patterns and execute automated trades with risk management strategies.",
        date: "August 2024 - October 2024",
        images_src: "images/projects/1.png",
        techs: [
            { name: "React", icon: "FaReact" as const, color: "#61DAFB" },
            { name: "Next.js", icon: "SiNextdotjs" as const, color: "#000000" },
            { name: "Tailwind", icon: "SiTailwindcss" as const, color: "#06B6D4" },
            { name: "Typescript", icon: "SiTypescript" as const, color: "#06B6D4" },
            { name: "Ruby on Rails", icon: "SiRubyonrails" as const, color: "#CC0000" },
            { name: "JWT", icon: "SiJsonwebtokens" as const, color: "#A91E50" },
            { name: "Ruby", icon: "SiRuby" as const, color: "#CC0000" },
            { name: "Postgresql", icon: "SiPostgresql" as const, color: "#FFFFF" },
        ],
        links: [
            { title: 'GitHub', url: 'https://github.com/username/trading-bot' },
        ],

        full_description:
            '## Problem\n\n' +
            'Traditional trading strategies often struggle to adapt to the rapidly evolving cryptocurrency markets, resulting in missed opportunities and potential losses. Manual trading approaches are limited by human reaction times and emotional biases, while existing automated solutions lack the sophistication to handle market complexity.\n\n' +
            'The challenge was further compounded by the need to process vast amounts of market data in real-time, manage risk effectively across multiple trading pairs, and maintain consistent performance during high-volatility periods.\n\n' +
            '## Action\n\n' +
            'Developed a sophisticated trading bot utilizing Python and TensorFlow to implement deep learning models. The system architecture was designed to process market data through multiple specialized neural networks, each focused on different aspects of market analysis - from price action and volume patterns to sentiment analysis of social media feeds.\n\n' +
            'Implemented advanced risk management algorithms that dynamically adjust position sizes and leverage based on market conditions and portfolio performance. Deployed the system on AWS using Docker containers for consistent performance, with automated failover and scaling capabilities to handle varying market conditions.\n\n' +
            '## Results\n\n' +
            'The trading bot has demonstrated exceptional performance across multiple metrics:\n\n' +
            '- 40% improvement in trade execution speed compared to previous systems\n' +
            '- 60% reduction in false trading signals through advanced filtering algorithms\n' +
            '- Maintained consistent profit margins even during high market volatility\n' +
            '- Successfully processes over 1 million market data points daily\n' +
            '- Sub-second response times for market condition changes\n' +
            '- 99.99% system uptime through robust infrastructure design',
    },
    {
        id: "6",
        image: "images/projects/1.png",
        title: "Yooneed",
        description: "Developed a sophisticated trading bot using machine learning algorithms to analyze market patterns and execute automated trades with risk management strategies.",
        date: 'December 2023',
        images_src: "images/projects/1.png",
        techs: [
            { name: "Ruby", icon: "SiRuby" as const, color: "#CC0000" },
            { name: "Ruby on Rails", icon: "SiRubyonrails" as const, color: "#CC0000" },
            { name: "Tailwind", icon: "SiTailwindcss" as const, color: "#06B6D4" },
            { name: "JWT", icon: "SiJsonwebtokens" as const, color: "#A91E50" },
            { name: "Postgresql", icon: "SiPostgresql" as const, color: "#FFFFF" },
        ],
        links: [
            { title: 'Live Demo', url: 'https://trading-bot.demo' },
            { title: 'GitHub', url: 'https://github.com/username/trading-bot' },
        ],

        full_description:
            '## Problem\n\n' +
            'Traditional trading strategies often struggle to adapt to the rapidly evolving cryptocurrency markets, resulting in missed opportunities and potential losses. Manual trading approaches are limited by human reaction times and emotional biases, while existing automated solutions lack the sophistication to handle market complexity.\n\n' +
            'The challenge was further compounded by the need to process vast amounts of market data in real-time, manage risk effectively across multiple trading pairs, and maintain consistent performance during high-volatility periods.\n\n' +
            '## Action\n\n' +
            'Developed a sophisticated trading bot utilizing Python and TensorFlow to implement deep learning models. The system architecture was designed to process market data through multiple specialized neural networks, each focused on different aspects of market analysis - from price action and volume patterns to sentiment analysis of social media feeds.\n\n' +
            'Implemented advanced risk management algorithms that dynamically adjust position sizes and leverage based on market conditions and portfolio performance. Deployed the system on AWS using Docker containers for consistent performance, with automated failover and scaling capabilities to handle varying market conditions.\n\n' +
            '## Results\n\n' +
            'The trading bot has demonstrated exceptional performance across multiple metrics:\n\n' +
            '- 40% improvement in trade execution speed compared to previous systems\n' +
            '- 60% reduction in false trading signals through advanced filtering algorithms\n' +
            '- Maintained consistent profit margins even during high market volatility\n' +
            '- Successfully processes over 1 million market data points daily\n' +
            '- Sub-second response times for market condition changes\n' +
            '- 99.99% system uptime through robust infrastructure design',
    },
]

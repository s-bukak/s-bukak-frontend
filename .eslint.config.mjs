export default {
    parser: '@babel/eslint-parser', // Babel을 파서로 사용
    parserOptions: {
        requireConfigFile: false, // Babel 설정 파일 필요 없음
        babelOptions: {
            presets: ['@babel/preset-react'], // React 사용 설정
        },
    },
    env: {
        browser: true, // 브라우저 환경 설정
        es2021: true, // 최신 ECMAScript 사용
        node: true, // Node.js 환경
    },
    extends: [
        'eslint:recommended', // 기본 추천 규칙 사용
        'plugin:react/recommended', // React용 추천 규칙
        'plugin:tailwindcss/recommended', // TailwindCSS용 추천 규칙
    ],
    plugins: ['react', 'tailwindcss'], // React 및 TailwindCSS 플러그인 사용
    rules: {
        'react/prop-types': 'off', // prop-types 규칙 비활성화 (TypeScript 사용 시 주로 비활성화)
        'react/react-in-jsx-scope': 'off', // React 17+에서는 필요 없음
        'tailwindcss/classnames-order': 'warn', // Tailwind 클래스명 순서 경고
        'tailwindcss/no-custom-classname': 'off', // 사용자 정의 클래스명을 허용
        // 추가 규칙 설정 가능
    },
    settings: {
        react: {
            version: 'detect', // 설치된 React 버전에 맞게 자동 설정
        },
    },
};

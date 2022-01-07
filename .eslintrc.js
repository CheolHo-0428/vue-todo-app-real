module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2015,
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true
    },
    extends: [
        'standard',
        'plugin:vue/essential'
    ],
    plugins: [
        'vue'
    ],
    rules: {
        'no-new': 0 //2는 경고메세지를 준다, 1은 사용하겠다, 0은 사용하지 않겠다.
    }
}
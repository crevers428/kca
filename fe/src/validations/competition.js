module.exports = {
    name: [
        v => !!v || '대회 이름을 입력하세요.',
        v => /^[가-힣a-zA-Z0-9\s]{6,50}$/.test(v) || '올바르지 않습니다!'
    ]
}

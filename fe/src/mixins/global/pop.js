export const pop = {
    data: () => ({
        isShow: false
    }),
    methods: {
        $_pop (msg, color) {
            if(color == undefined) {
                color = ''
            }
            this.$EventBus.$emit('pop', { msg, color })
        },
        $_up (msg, color) {
            this.$_pop(msg, color)
        },
        $_error (msg) {
            this.$_up(msg, 'error')
        }
    }
}

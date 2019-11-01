export const comp = {
    data: () => ({
        $_comp: {}
    }),
    methods: {
        $_setComp: function () {
            return this.$axios.get(`competition/${this.$route.params.id}`)
                .then((r) => {
                    if(!r.data.comp) this.$router.push('/comp')
                    this.comp = r.data.comp
                    this.$EventBus.$emit('setCompNav', r.data.comp)
                })
                .catch(() => {
                    this.$router.push('/comp')
                })
        }
    }
}

export const comp = {
    data: () => ({
        $_comp: {}
    }),
    methods: {
        $_setComp () {
            console.log("?")
            this.$axios.get(`competition/${this.$route.params.id}`)
                .then((r) => {
                    if(!r.data.comp) this.$router.push('/comp')
                    this.$_comp = r.data.comp
                    this.$EventBus.$emit('setCompNav', r.data.comp)
                })
                .catch(() => {
                    this.$router.push('/comp')
                })
        }
    }
}

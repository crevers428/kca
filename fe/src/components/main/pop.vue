<template>
    <v-snackbar
        v-model="show"
        :color="color"
        :timeout="timeout"
    >
        {{msg}}
        <v-btn text @click="show = false">닫기</v-btn>
    </v-snackbar>
</template>
<script>
export default {
    data: () => ({
        show: false,
        msg: '',
        color: '',
        timeout: 2000
    }),
    methods: {
        pop (data) {
            this.show = true
            if(data.color !== undefined ){
                this.msg = data.msg
                this.color = data.color
            } else {
                this.color = null
                this.msg = data
            }
        }
    },
    created () {
        this.$EventBus.$on('pop', (data) => {
            this.pop(data)
        })
    }
}
</script>

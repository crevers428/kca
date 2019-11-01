<template>
<v-container
    wrap
    style="max-width: 1024px;"
>
    <v-row>
        <comp-form :comp="comp" @ok="gotOk" @no="valid = false"></comp-form>
    </v-row>
    <v-row justify="center">
        <v-btn color="warning" class="ma-1" large :to="`/comp/${$route.params.id}`">뒤로</v-btn>
        <v-btn color="primary" class="ma-1" large @click="update" :disabled="!valid">대회 수정</v-btn>
    </v-row>
</v-container>
</template>
<script>
import { pop } from '../../mixins/global/pop.js'
import compForm from '../../components/comp/form.vue'
export default {
    components: {
        compForm
    },
    mixins: [pop],
    data: () => ({
        valid: false,
        comp: {},
        data: {}
    }),
    methods: {
        update () {
            this.$axios.put(`competition/${this.$route.params.id}`, this.data)
                .then((r) => {
                    if(!r.data.success) throw new Error(r.data.msg)
                    this.$router.push(`/comp/${r.data.newId}`)
                    this.$_up('대회가 수정되었습니다.')
                })
                .catch((e) => {
                    this.$_error(e.message, 'error')
                })
        },
        setComp () {
            this.$axios.get(`competition/${this.$route.params.id}`)
                .then((r) => {
                    this.comp = r.data.comp
                })
                .catch((e) => {
                    this.$_error(e.message, 'error')
                })
        },
        gotOk (data) {
            this.valid = true
            this.data = data
        }
    },
    mounted () {
        this.setComp()
    }
}
</script>

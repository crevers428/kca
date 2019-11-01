<template>
<v-container
    wrap
    style="max-width: 1024px;"
>
    <v-row
        justify="center"
    >
        <hy-title
            v-bind="{
                    font: `font-family:'Sunflower'; font-weight:500;`,
                    position: 'relative',
                    positionOptions: ``,
                    borderLeft: 5,
                    borderColor: '#FFA000',
                    main: '대회 등록',
                    mainFont: 'font-size: 2rem;',
                    sub: '',
                    subFont: 'font-size: 1rem;',
                    sheet: false
            }"
            style="margin: 0 0 0 0;"
        />
    </v-row>
    <v-row>
        <comp-form v-on:ok="gotOk" v-on:no="valid = false"></comp-form>
    </v-row>
    <v-row justify="center">
        <v-btn color="primary" large :disabled="!valid" @click="create">대회 등록</v-btn>
    </v-row>
</v-container>
</template>
<script>
import hyTitle from '../../components/hy/Title.vue'
import { pop } from '../../mixins/global/pop.js'
import compForm from '../../components/comp/formNew.vue'
export default {
    components: {
        hyTitle, compForm
    },
    mixins: [ pop ],
    data: () => ({
        valid: false,
    }),
    methods: {
        gotOk (data) {
            this.valid = true
            this.data = data
        },
        create () {
            this.$axios.post('competition', this.data)
                .then((r) => {
                    this.$_pop('대회가 등록되었습니다.')
                    this.$router.push(`/comp/${r.data.newId}/dashboard`)
                })
                .catch((e) => {
                    this.$_error(e.message)
                })
        }
    }
}
</script>

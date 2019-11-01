<template>
<v-container style="max-width:1024px;" class="pa-10">
    <div class="" style="font-size: 1.5rem;">기본 정보</div>
    <v-row class="pa-3">
        <comp-form v-bind:comp="comp" v-on:ok="basicEdit" v-on:no="canEdit = false"></comp-form>
    </v-row>
    <v-divider></v-divider>
    <v-btn
        v-show="canEdit"
        class="mx-2"
        fab dark large
        color="warning"
        style="position: fixed; bottom: 1rem; right: 1rem;"
        @click="edit"
    >
        <v-icon dark outlined>edit</v-icon>
    </v-btn>
</v-container>
</template>
<script>
import compForm from '../../components/comp/formNew.vue'
import { pop } from '../../mixins/global/pop.js'
import { comp } from '../../components/comp/mixin.js'

export default {
    components: {
        compForm
    },
    mixins: [pop, comp],
    data: function () { return {
        canEdit: false,
        data: {},
        comp: {}
    }},
    methods: {
        basicEdit (data) {
            this.canEdit = true
            this.data = data
        },
        edit () {
            this.$axios.put(`competition/${this.$route.params.id}`, this.data)
                .then((r) => {
                    if(r.data.newId != undefined && r.data.newId != this.$route.params.id) {
                        this.$router.push(`/comp/${r.data.newId}/dashboard`)
                    }
                    else {
                        this.$_setComp()
                        this.canEdit = false
                        this.$_up('정보가 수정되었습니다.', 'success')
                    }
                })
                .catch((e) => {
                    this.$_error(e.message)
                })
        }
    },
    mounted () {
        this.$_setComp()
    }
}
</script>

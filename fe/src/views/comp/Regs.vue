<template>
<v-container max-width="100%">
    <v-tabs v-model="tab">
        <v-tab>대기 명단 ({{yet.length}})</v-tab>
        <v-tab>승인 명단 ({{ok.length}})</v-tab>
        <v-tab>삭제 명단 ({{del.length}})</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
        <v-tab-item>
            <reg-table
                v-bind:comp="comp"
                v-bind:people="yet"
                v-on:editOn="editOn"
                v-on:reset-regs="setRegs"
                type="normal"
            ></reg-table>
        </v-tab-item>
        <v-tab-item>
            <reg-table
                v-bind:comp="comp"
                v-bind:people="ok"
                v-on:editOn="editOn"
                v-on:reset-regs="setRegs"
                type="approve"
            ></reg-table>
        </v-tab-item>
        <v-tab-item>
            <reg-table
                v-bind:comp="comp"
                v-bind:people="del"
                v-on:editOn="editOn"
                v-on:reset-regs="setRegs"
                type="deleted"
            ></reg-table>
        </v-tab-item>
    </v-tabs-items>
    <v-dialog
        max-width="1024px"
        light
        v-model="dialog"
    >
        <v-card>
            <v-card-title>참가자 등록</v-card-title>
            <div class="pa-7">
                <person-form
                    v-on:ok="gotOk" v-on:no="formOk = false"
                    v-bind:person="personOn"
                    ref="personForm"
                    :availableEvents="comp.events"
                ></person-form>
            </div>
            <v-card-actions>
                <v-row class="pa-5 ma-0" justify="center" v-if="!personOn.name">
                    <v-btn color="primary" x-large @click="add" :disabled="!formOk">등록</v-btn>
                </v-row>
                <v-row class="pa-5 ma-0" justify="center">
                    <v-btn color="warning" x-large @click="edit" v-if="personOn.name" :disabled="!formOk">수정</v-btn>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-btn
        class="mx-2"
        fab dark large
        color="primary"
        style="position: fixed; bottom: 1rem; right: 1rem;"
        @click="newPerson"
    >
        <v-icon dark outlined>add</v-icon>
    </v-btn>
</v-container>
</template>
<script>
import { pop } from '../../mixins/global/pop.js'
import { comp } from '../../components/comp/mixin.js'
import personForm from '../../components/person/form.vue'
import regTable from '../../components/comp/regs/table.vue'
export default {
    components: {
        personForm, regTable
    },
    mixins: [pop, comp],
    data: function () { return {
        comp: {},
        tab: 0,
        dialog: false,
        formOk: false,
        formData: {},
        personOn: {},
        yet: [],
        ok: [],
        del: []
    }},
    methods: {
        setRegs () {
            this.$axios.get(`competition/${this.$route.params.id}/register/`)
                .then((r) => {
                    this.yet = []
                    this.ok = []
                    this.del = []
                    r.data.regs.forEach(reg => {
                        if(reg.deleted > 0) this.del.push(reg)
                        else {
                            if(reg.status > 0) this.ok.push(reg)
                            else this.yet.push(reg)
                        }
                    })
                })
                .catch((e) => {
                    this.$_error(e.message)
                })
        },
        gotOk (data) {
            this.formOk = true
            this.formData = data
        },
        newPerson () {
            this.dialog = true
            this.personOn = {}
        },
        add () {
            this.$axios.post(`competition/${this.$route.params.id}/register`, this.formData)
                .then(()=> {
                    this.setRegs()
                    this.$_up('참가자가 등록되었습니다.', 'success')
                    this.dialog = false
                })
                .catch((e) => {
                    this.$_error(e.message)
                })
        },
        editOn (person) {
            this.dialog = true
            this.personOn = person
        },
        edit () {
            this.$axios.put(`competition/${this.$route.params.id}/register/${this.personOn._id}`, this.formData)
                .then(() => {
                    this.setRegs()
                    this.$_up('참가자 정보가 수정되었습니다.', 'success')
                    this.dialog = false
                })
                .catch((e) => {
                    this.$_error(e.message)
                })
        }
    },
    mounted () {
        this.$_setComp()
        this.setRegs()
    }
}
</script>

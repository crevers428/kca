<template>
<v-hover v-slot:default="{ hover }">
<v-card
    outlined
    @keydown="keydown"
    ref="form"
    width="18rem"
    class="pt-3 pb-3"
>
    <v-row>
        <v-col class="pa-0 ma-1" align="center">
            <field v-model="merge[0]" :old="old[0]" autofocus></field>
        </v-col>
    </v-row>
    <v-row>
        <v-col class="pa-0 ma-1" align="center">
            <field v-model="merge[1]" :old="old[1]"></field>
        </v-col>
    </v-row>
    <v-row v-if="type == 'a' || type == 'm' || type =='3'">
        <v-col class="pa-0 ma-1" align="center">
            <field v-model="merge[2]" :old="old[2]"></field>
        </v-col>
    </v-row>
    <v-row v-if="type == 'a'">
        <v-col class="pa-0 ma-1" align="center">
            <field v-model="merge[3]" :old="old[3]"></field>
        </v-col>
    </v-row>
    <v-row v-if="type == 'a'">
        <v-col class="pa-0 ma-1" align="center">
            <field v-model="merge[4]" :old="old[4]"></field>
        </v-col>
    </v-row>
    <v-row>
        <v-col class="mt-5 pa-0 ma-1" align="center">
            <submit ref="submit" @submit="submit"></submit>
        </v-col>
    </v-row>
</v-card>
</v-hover>
</template>
<script>
import Field from './scoreTakerField.vue'
import Submit from './scoreTakerSubmit.vue'
export default {
    components: { Field, Submit },
    props: {
        ev: { type: String, default: '333' },
        type: { type: String, default: 'a' },
        value: { type: Array },
        old: { type: Array, default: () => { return new Array() } }
    },
    data: function () {
        return {
        }
    },
    computed: {
        fieldsNum () {
            if(this.type == 'a') return 5
            else if(this.type == 'm' || this.type == '3') return 3
            else if(this.type == '2') return 2
            else return 1
        },
        merge: {
            get () {
                return this.value
            },
            set (merge) {
                this.$emit('input', merge)
            }
        }
    },
    methods: {
        keydown (e) {
            if(e.keyCode == 13) {
                const i = this.getFocused()
                this.nextField()
            }
            else if(e.keyCode == 40) {
                this.nextField()
            }
            else if(e.keyCode == 38){
                this.prevField()
            }
        },
        nextField () {
            const i = this.getFocused()

            if(i + 1 < this.fieldsNum) {
                this.$refs.form.$children[i + 1].focus()
            }
            else {
                this.$refs.submit.focus()
            }

        },
        prevField () {
            const i = this.getFocused()

            if(i > 0) {
                this.$refs.form.$children[i - 1].focus()
            }
        },
        getFocused () {
            return this.$refs.form.$children.findIndex(x => x.focused == true)
        },
        setRecord () {
            this.$axios.get()
        },
        submit () {
            this.$emit('submit')
        }
    }
}
</script>

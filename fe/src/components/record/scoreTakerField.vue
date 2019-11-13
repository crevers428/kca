<template>
<div
    style="
        position: relative;
        width: 15rem;
        height: 4rem;
        border: 2px solid;"
    :style="`border-color: ${ (focused) ? '#039BE5' : '#D5D5D5'};`"
>
    <v-text-field
        outlined
        ref="field"
        @focus="focused = true"
        @blur="focused = false"
        @keydown="keydown"
        autocomplete="off"
    >
    </v-text-field>
    <v-sheet
        color="white"
        style="
            width: 100%; height: 100%;
            position: absolute; top: 0;
            font-size: 2.6rem; cursor: pointer;
        "
        :style="`
            color: ${ (changed) ? '#FF8F00' : '#424242'};
        `"
        class="pr-1 pl-1 font-weight-light text-center"
        @click="focus"
    >
        {{ mod }}
    </v-sheet>
</div>
</template>
<script>
import { recordTrans } from './mixin.js'
export default {
    props: {
        type: { type: String, default: 'time' },
        autofocus: { type: Boolean, default: false },
        value: { type: Number, default: null },
        old: { type: Number, default: null }
    },
    mixins: [recordTrans],
    data: function () {
        return {
            focused: false,
            changed: false,
        }
    },
    computed: {
        input: {
            get () {
                let record = this.value
                return this.$_recordToInput(record)
            },
            set (input) {
                const value = this.$_inputToRecord(input)
                if(value != this.old) {
                    this.changed = true
                }
                else {
                    this.changed = false
                }
                this.$emit('input', value)
            }
        },
        mod () {
            return this.inputText(this.input)
        }
    },
    watch: {
        old () {
            this.changed = false
        }
    },
    methods: {
        focus () {
            this.$refs.field.focus()
        },
        inputText (input) {
            if(input == 's') return 'DNS'
            else if(input == 'd') return 'DNF'
            else if(input == '') return '0:00:00.00'
            else {
                const text = ("0000000" + input).slice(-7)

                return text.substr(0, 1) + ":" + text.substr(1, 2) + ":" + text.substr(3, 2) + "." + text.substr(5, 2)
            }
        },
        keydown (e) {
            let input = this.input
            if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                const length = input.length
                if(length === 0 && e.keyCode == 48) return false

                if(input == 'd' || input == 's' || input == 'NaN') {
                    input = ''
                }

                const stand = (this.type == 'time') ? 7 : 3
                if(length < stand) {
                    input += e.key
                }

                this.input = input
            }
            else if(e.keyCode == 8 || e.keyCode == 46) {
                const length = input.length
                if(input == 'd' || input == 's' || input == 'NaN') {
                    input = ''
                }
                else if(length > 0) {
                    input = input.substr(0 , length - 1)
                }

                this.input = input
            }
            else if(e.keyCode == 68 || e.keyCode == 51) {
                input = 'd'
                this.input = input
            }
            else if(e.keyCode == 83 || e.keyCode == 56) {
                input = 's'
                this.input = input
            }
            else if(e.keyCode == 82 || e.keyCode == 187) {
                if(this.old != undefined) {
                    this.$emit('input', this.old)
                    this.changed = false
                }
            }
        }
    },
    mounted () {
        if(this.autofocus) {
            this.focus()
        }
    }
}
</script>

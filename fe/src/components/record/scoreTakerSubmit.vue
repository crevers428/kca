<template>
<div style="position: relative; width: 15rem; height: 4rem; border: 1px solid #D5D5D5;">
    <v-text-field
        outlined
        ref="submit"
        @focus="focused = true"
        @blur="focused = false"
        autocomplete="off"
        @keydown="keydown"
    >
    </v-text-field>
    <v-sheet
        color="white"
        style="
            width: 100%; height: 100%;
            position: absolute; top: 0;
            font-size: 2rem; cursor: pointer;
        "
        :style="`
            color: ${(focused) ? '#039BE5' : '#424242'};
        `"
        class="pr-1 pl-1 pt-2 font-weight-light text-center"
        @click="click"
    >
        확인
    </v-sheet>
</div>
</template>
<script>
export default {
    props: {
        autofocus: { type: Boolean }
    },
    data: function () {
        return {
            focused: false
        }
    },
    methods: {
        focus () {
            this.$refs.submit.focus()
        },
        submit () {
            this.$emit('submit')
        },
        click () {
            this.focus()
            this.submit()
        },
        keydown (e) {
            if(e.keyCode == 13) {
                this.submit()
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

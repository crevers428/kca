<template>
<v-btn
    v-show="$vuetify.breakpoint.smAndDown"
    color="indigo lighten-1" fab large dark
    style="position: fixed; bottom: 1rem; left: 1rem;"
    @click="navShow"
>
    <v-icon>subject</v-icon>
</v-btn>
</template>
<script>
export default {
    methods: {
        navShow () {
            this.$EventBus.$emit('navCompDrawer')
        }
    }
}
</script>

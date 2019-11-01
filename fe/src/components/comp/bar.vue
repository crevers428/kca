<template>
<v-app-bar
    app
    elevation=0
    style="border: 1px solid #D5D5D5; border-width: 0 0 1px 0;"
>
    <v-toolbar-title>
        <div>{{comp.name}}</div>
        <div v-if="comp.date" style="font-size: 0.8rem;" class="grey--text pr-3">
            {{$moment(comp.date.start).format('ll')}}
            <span v-if="comp.date.start != comp.date.end">&nbsp;~&nbsp;{{$moment(comp.date.end).format('ll')}}</span>
        </div>
    </v-toolbar-title>
</v-app-bar>
</template>
<script>
export default {
    data () {
        return {
            comp: {
                name: '',
                data: {
                    start: '',
                    end: ''
                }
            }
        }
    },
    methods: {
        setComp (data) {
            this.comp = data
        }
    },
    created () {
        this.$EventBus.$on('setCompNav', this.setComp)
    }
}
</script>

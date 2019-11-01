<template>
<v-container class="pt-10">
    <v-row>
        <v-col md="6" sm="6" v-for="(page, i) in pages" :key="i">
            <v-card>
                <v-card-title>{{page.name}}</v-card-title>
                <v-card-text>
                    <div>권한 레벨 : {{page.lv}}</div>
                    <div>방문 횟수 : {{page.inCnt}}</div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="" :to="`/${page.name}`">방문</v-btn>
                    <v-btn color="success" @click="lvUp(page._id, page.lv)">권한 레벨 +</v-btn>
                    <v-btn color="warning" @click="lvDown(page._id, page.lv)">권한 레벨 -</v-btn>
                    <v-btn color="error" @click="delPage(page._id)">삭제</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>
<script>
import axios from 'axios'
export default {
    data: () => ({
        pages: []
    }),
    methods: {
        getPages () {
            axios.get('page')
                .then((r) => {
                    if(!r.data.success) return console.error(r)
                    this.pages = r.data.pages
                })
                .catch((e) => {
                    console.errer(e.message)
                })
        },
        lvUp (_id, lv) {
            if( lv < 3 ) {
                lv++;
                this.putPage(_id, lv)
            }
        },
        lvDown (_id, lv) {
            if( lv > 0 ) {
                lv--;
                this.putPage(_id, lv)
            }
        },
        delPage (_id) {
            this.$axios.delete(`page/${_id}`)
                .then((r) => {
                    if(!r.data.success) return console.error(r)
                    this.dialog = false
                    this.getPages()
                })
                .catch((e) => {
                    console.log(e.message)
                })
        },
        putPage (_id, lv) {
            this.$axios.put(`page/${_id}`,
                {lv: lv},)
                .then((r) => {
                    if(!r.data.success) return console.error(r)
                    this.dialog = false
                    this.getPages()
                })
                .catch((e) => {
                    console.log(e.message)
                })
        }
    },
    mounted () {
        this.getPages()
    }
}
</script>

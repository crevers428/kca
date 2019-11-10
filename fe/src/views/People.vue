<template>
<v-container
    :fill-height="!ready"
    style="width: 100%;"
>
    <v-row align="center" justify="center" :class="(ready) ? '' : 'mt-n12'">
        <v-col cols=12 align="center" :class="(ready) ? '' : 'mt-n12'">
            <div
                class="pa-5"
                :class="(ready) ? '' : 'mb-10'"
                style="font-size: 2.5rem;"
            >
                개인 기록
            </div>
            <v-text-field
                outlined
                label="이름"
                clearable
                v-model="keyword"
                append-outer-icon="search"
                @click:append-outer="search"
                @input="inputChanged"
                v-on:keyup.enter="search"
                autofocus
                style="width: 30rem;"
            >
            </v-text-field>
        </v-col>
    </v-row>
    <v-divider v-show="ready" ></v-divider>
    <v-row v-show="ready" style="transition: 1s all ease;">
        <v-col>
            <v-card outlined>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th></th>
                                <th class="text-center" style="width: 7rem; white-space: nowrap;">아이디</th>
                                <th class="text-center" style="width: 7rem; white-space: nowrap;">이름</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-if="message">
                            <tr>
                                <td colspan=4 class="text-center pa-5">
                                    {{ message }}
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-if="!searching">
                            <tr v-for="(p, i) in people" :key="i" @click="$router.push(`/person/${p.id}`)">
                                <td></td>
                                <td style="white-space: nowrap;" class="text-center">{{ p.id }}</td>
                                <td style="white-space: nowrap;" class="text-center">{{ p.name }}</td>
                                <td></td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan=4 class="text-center pt-10 pb-10">
                                    <v-progress-circular
                                        :size="70"
                                        :width="7"
                                        color="grey"
                                        indeterminate
                                    ></v-progress-circular>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>
<script>
import { pop } from '../mixins/global/pop.js'
export default {
    mixins: [pop],
    data: function () {
        return {
            ready: false,
            searching: false,
            keyword: '',
            people: [],
            message: ''
        }
    },
    methods: {
        search: async function () {
            this.searching = true
            this.message = ''

            if(this.keyword.length < 2) {
                this.searching = false
                this.message = '검색어가 너무 짧습니다.'
                return
            }
            await this.$axios.get(`person/search/${this.keyword}`)
                .then( r => {
                    this.ready = true
                    if(r.data.short) return this.message = '검색어가 너무 짧습니다.'
                    if(r.data.people.length == 0) {
                        this.people = []
                        return this.message = '검색 결과가 없습니다.'
                    }
                    this.people = r.data.people
                })
                .catch( e => {
                    this.$_error(e.message)
                })
            this.searching = false
        },
        inputChanged () {
            if(this.keyword == '') {
                this.ready = false
            }
        }
    }
}
</script>

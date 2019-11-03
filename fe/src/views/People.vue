<template>
<v-container>
    <v-row align="center" justify="center">
        <div class="display-1 font-weight-bold pa-5">개인 기록</div>
    </v-row>
    <v-row align="center" justify="center" class="pl-10 pr-10">
        <v-col align="center">
            <v-text-field
                outlined
                label="이름"
                clearable
                v-model="keyword"
                append-outer-icon="search"
                @click:append-outer="search"
                v-on:keyup.enter="search"
            >
            </v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
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
                    if(r.data.short) return this.message = '검색어가 너무 짧습니다.'
                    if(r.data.people.length == 0) return this.message = '검색 결과가 없습니다.'
                    this.people = r.data.people
                })
                .catch( e => {
                    this.$_error(e.message)
                })
            this.searching = false
        }
    }
}
</script>

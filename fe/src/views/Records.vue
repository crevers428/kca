<template>
<v-container
    style="width: 100%;"
>
    <v-row align="center" justify="center">
        <v-col cols=12 sm=12 md=6 align="center">
            <div
                class="pa-5"
                style="font-size: 2.5rem;"
            >
                기록 검색
            </div>
            <v-text-field
                regular
                hint="대회이름 종목 선수"
                clearable
                v-model="keyword"
                prepend-icon="help"
                append-outer-icon="search"
                @click:prepend="help = !help"
                @click:append-outer="search"
                @input="inputChanged"
                v-on:keyup.enter="search"
                autofocus
            >
            </v-text-field>
        </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
        <v-col>
            <v-card outlined>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-center" style="width: 5rem; white-space: nowrap;">날짜</th>
                                <th class="text-center" style="width: 5rem; white-space: nowrap;">대회</th>
                                <th class="text-center" style="width: 5rem; white-space: nowrap;">선수</th>
                                <th class="text-center" style="width: 5rem; white-space: nowrap;">종목</th>
                                <th class="text-center" style="width: 3rem; white-space: nowrap;">라운드</th>
                                <th class="text-center" style="width: 4rem; white-space: nowrap;">평균</th>
                                <th class="text-center" style="width: 4rem; white-space: nowrap;">싱글</th>
                                <th class="text-center" style="width: 5rem; white-space: nowrap;">기록 상세</th>
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
                            <tr v-for="(r, i) in results" :key="i" @click="$router.push(`/record/mod/${r._id}`)">
                                <td style="white-space: nowrap;" class="text-right">{{ $moment(r.date).format('ll')}}</td>
                                <td style="white-space: nowrap;" class="text-center">{{ r.compName }}</td>
                                <td style="white-space: nowrap;" class="text-center">{{ r.personName }}</td>
                                <td style="white-space: nowrap;" class="text-right">{{ ofcEventsText[r.event] }}</td>
                                <td class="text-center">{{ r.round }}</td>
                                <td class="text-right">{{ $_recordToText(r.mean) }}</td>
                                <td class="text-right">{{ $_recordToText(r.best) }}</td>
                                <td style="white-space: nowrap;">
                                    <div
                                        v-for="(d, i) in r.detail"
                                        :key="i"
                                        style="display: inline-block; white-space: nowrap; width: 5rem; font-size: 0.9rem;"
                                        class="text-right"
                                    >
                                        {{ $_recordToText(d) }}
                                    </div>
                                </td>
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
    <v-dialog v-model="help" width="500px">
        <v-card outlined>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                검색 방법
            </v-card-title>
            <v-card-text class="pt-3">
                <div style="font-size: 1.2rem;">방법 1 : 대회이름 종목 선수이름</div>
                <div class="pl-12">예 : 그랑프리 333 하빈</div>
                <div style="font-size: 1.2rem;">방법 2 : 대회이름 or 선수이름 종목</div>
                <div class="pl-12">예 : 학생큐브 333, 최고호 333</div>
                <div style="font-size: 1.2rem;">방법 3 : 선수이름</div>
                <div class="pl-12">예 : 최고, 장준</div>
                <div class="mt-5" style="color: #D84315;">##2자 이상 입력</div>
            </v-card-text>
        </v-card>
    </v-dialog>
</v-container>
</template>
<script>
import ofcEvents from '../forms/events.js'
import { pop } from '../mixins/global/pop.js'
import { recordTrans } from '../components/record/mixin.js'
export default {
    mixins: [pop, recordTrans],
    data: function () {
        return {
            ready: false,
            searching: false,
            ofcEventsText: ofcEvents.events,
            keyword: '',
            results: [],
            message: '',
            help: false
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
            await this.$axios.get(`records/search/${this.keyword}`)
                .then( r => {
                    this.ready = true
                    if(r.data.short) return this.message = '검색어가 너무 짧습니다.'
                    if(r.data.results.length == 0) {
                        this.results = []
                        return this.message = '검색 결과가 없습니다.'
                    }
                    this.results = r.data.results
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

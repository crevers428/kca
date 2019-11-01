<template>
<v-simple-table fixed-header>
    <template v-slot:default>
        <thead>
            <tr>
                <th class="text-center" style="white-space: nowrap; width: 5rem;">이름</th>
                <th class="text-center" style="white-space: nowrap; width: 6rem;">소속</th>
                <th class="text-center" style="white-space: nowrap; width: 6rem;">생년월일</th>
                <th class="text-center" style="white-space: nowrap; width: 6rem;">신청일</th>
                <th v-for="ev in comp.events" :key="ev" class="text-center pa-1">{{ev}}</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="person in people"
                :key="person._id">
                <td style="white-space: nowrap;">{{ person.name }}</td>
                <td style="white-space: nowrap;">{{ person.division }}</td>
                <td style="white-space: nowrap;">{{ $moment(person.birthday).format('YYYY-MM-DD') }}</td>
                <td style="white-space: nowrap;">{{ $moment(person.regDate).format('YYYY-MM-DD') }}</td>
                <td v-for="ev in comp.events" :key="ev" class="text-center pa-1 caption grey--text">
                    <span v-if="person.events.indexOf(ev) >= 0">{{ev}}</span>
                </td>
                <td style="white-space: nowrap;">
                    <v-icon style="cursor: pointer;" @click="editOn(person)">edit</v-icon>
                    <v-icon v-if="type == 'approve'" color="warning" style="cursor: pointer;" @click="reject(person._id)">cancel</v-icon>
                    <v-icon v-if="type == 'normal'" color="success" style="cursor: pointer;" @click="approve(person._id)">check</v-icon>
                    <v-icon v-if="type != 'deleted'" style="cursor: pointer;" color="error" @click="deletePerson(person._id)">delete</v-icon>
                    <v-icon v-else style="cursor: pointer;" color="primary" @click="restore(person._id)">refresh</v-icon>
                </td>
            </tr>
        </tbody>
    </template>
</v-simple-table>
</template>
<script>
import { pop } from '../../../mixins/global/pop.js'
export default {
    mixins: [pop],
    props: {
        comp: { type: Object },
        people: { type: Array },
        type: { type: String, default: "normal" }
    },
    methods: {
        editOn (person) {
            this.$emit('editOn', person)
        },
        deletePerson (_id) {
            this.$axios.put(`competition/${this.$route.params.id}/register/${_id}`, { deleted: 1 })
                .then(() => {
                    this.$emit('reset-regs')
                    this.$_pop('참가자가 삭제되었습니다.', 'error')
                })
                .catch((e) => {
                    this.$_error(e.message)
                })        },
        restore (_id) {
            this.$axios.put(`competition/${this.$route.params.id}/register/${_id}`, { deleted: 0 })
                .then(() => {
                    this.$emit('reset-regs')
                    this.$_pop('참가자가 복구되었습니다.', 'success')
                })
                .catch((e) => {
                    this.$_error(e.message)
                })
        },
        approve(_id) {
            this.$axios.put(`competition/${this.$route.params.id}/register/${_id}`, { status: 1 })
                .then(() => {
                    this.$emit('reset-regs')
                    this.$_pop('승인되었습니다.', 'success')
                })
                .catch((e) => {
                    this.$_error(e.message)
                })
        },
        reject(_id) {
            this.$axios.put(`competition/${this.$route.params.id}/register/${_id}`, { status: 0 })
                .then(() => {
                    this.$emit('reset-regs')
                    this.$_pop('취소되었습니다.', 'success')
                })
                .catch((e) => {
                    this.$_error(e.message)
                })
        }
    }
}
</script>

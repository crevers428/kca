<template>
    <v-container class="mt-12">
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Birthday</th>
                        <th>Level</th>
                        <th>Login Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id" @dblclick="putDialog(user)">
                        <td>{{user.id}}</td>
                        <td>{{user.name}}</td>
                        <td>{{user.email}}</td>
                        <td>{{user.birthday}}</td>
                        <td>{{user.lv}}</td>
                        <td>{{user.inCnt}}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">User Profile</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Name*" required v-model="form.name"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    label="birthday*"
                                    required
                                    v-model="form.birthday"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Email*" required v-model="form.email"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select
                                    :items="lv"
                                    label="Level*"
                                    required
                                    v-model="form.lv"
                                ></v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="red darken-1" text @click="deleteUser">삭제</v-btn>
                    <v-btn color="blue darken-1" text @click="dialog = false">닫기</v-btn>
                    <v-btn color="blue darken-1" text @click="putUser">저장</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar
            color=""
            v-model="snackbar.show"
            :timeout="snackbar.timeout"
        >
            {{snackbar.msg}}
            <v-btn color="red" text @click="snackbar.show = false">닫기</v-btn>
        </v-snackbar>
    </v-container>
</template>
<script>
import axios from 'axios'
export default {
    data: () => ({
        dialog: false,
        form: {
            id: '',
            name: '',
            email: '',
            birthday: '',
            lv: ''
        },
        users: [],
        lv: [0, 1, 2, 3],
        snackbar: {
            show: false,
            msg: "",
            timeout: 50000
        }
    }),
    methods: {
        getUsers () {
            axios.get('manage/user')
                .then((r) => {
                    this.users = r.data.users
                })
                .catch((e) => {
                    this.pop(e.message)
                })
        },
        putDialog (user) {
            this.dialog = true,
            this.form.id = user.id,
            this.form.name = user.name,
            this.form.birthday = user.birthday,
            this.form.email = user.email,
            this.form.lv = user.lv
        },
        putUser () {
            axios.put(`manage/user/${this.form.id}`,
                {name: this.form.name, birthday: this.form.birthday, email: this.form.email, lv: this.form.lv})
                .then((r) => {
                    if(!r.data.success) throw new Error(r.data.msg)
                    this.dialog = false
                    this.pop(`User '${r.data.user}' has successfully changed.`)
                    this.getUsers()
                })
                .catch((e) => {
                    this.pop(e.message)
                })
        },
        deleteUser () {
            if(confirm('정말 삭제하시겠습니까?')) {
                axios.delete(`manage/user/${this.form.id}`)
                    .then((r) => {
                        if(!r.data.success) throw new Error(r.data.msg)
                        this.dialog = false
                        this.pop(`User '${r.data.user}' has successfully deleted.`)
                        this.getUsers()
                    })
                    .catch((e) => {
                        this.pop(e.message)
                    })
            }
        },
        pop (msg) {
            this.snackbar.show = true
            this.snackbar.msg = msg
        }
    },
    mounted () {
        this.getUsers()
    }
}
</script>

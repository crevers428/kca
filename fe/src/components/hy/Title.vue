<template>
    <div
        style="
            display:block;
            transition: 1s all ease;
        "
        :style="`
            ${positionOptions}
            position: ${position};
            ${sheet ? 'background-color: rgba(255,255,255, 0.7);' : ''}
            ${font}
        `"
        class="hyTitle"
        :class="sheet ? 'pa-10' : 'pa-0'"
    >
        <div class="trans ease-out" :style="`height:${borderTop}px; background:${borderColor};`"><!-- borderTop -->
        </div>
        <div
            :style="`
                padding:0;
                paddingLeft:${borderLeft / 2}px;
                paddingRight:${borderRight / 2}px;
            `"
        >
            <!-- borderLeft -->
            <div
                class="trans ease-in"
                :style="`
                    position:absolute;
                    top:0;
                    left:-${borderLeft / 2}px;
                    width:${borderLeft}px;
                    background:${borderColor};
                    height:100%;
                `"
            ></div>
            <!-- content -->
            <div
                class="trans"
                style="padding: 0.5rem;"
            >
                <div
                    class="trans"
                    style="
                        white-space: nowrap;
                        margin: 0;
                        padding: 0;
                        line-height: 1.1;
                    "
                    :style="mainFont"
                    v-html="main"
                ></div>
                <div
                    class="trans"
                    style="
                        white-space: nowrap;
                        text-align: right;
                        padding: 0;
                        paddingRight: 1rem;
                        margin: 0;
                    "
                    :style="subFont"
                    v-html="sub"
                ></div>
            </div>
            <!-- borderRight -->
            <div
                class="trans ease-out"
                :style="`
                    position:absolute;
                    top:0;
                    right:-${borderRight / 2}px;
                    width:${borderRight}px;
                    background:${borderColor};
                    height:100%;
                `"
            ></div>
        </div>
        <div class="trans ease-out" :style="`height:${borderBottom}px; background:${borderColor};`"></div><!-- borderBottom -->
        <!--
        <v-container
            class="pa-0"
        >
            <v-row
                style=""
                fill-height
            >
            position: ${fixed ? 'fixed' : 'relative'};
                <div
                    style="transition: 1s all ease;"
                    :style="`
                        background: ${borderColor};
                        width: 100%;
                        height: ${borderTop}px;
                    `"
                ></div>
            </v-row>
            <v-row>
                <v-col
                    class="pa-0"
                    style="color:#424242;"
                >
                    <div
                        style="left:0; height:100%; transition: 1s all ease;"
                        :style="`
                            width: ${borderLeft}px;
                            background: ${borderColor};
                        `"
                    ></div>
                    <div
                        style="
                            transition:0.5s all ease-out;
                            white-space:nowrap; position:relative;
                            top:-100%;
                            font-family: Godo;
                        "
                        :style="`left: ${borderLeft}px`"
                        class="pt-5 pl-5 pr-5"
                        :class="`${mainFont}`"
                        v-html="main"
                    >
                    </div>
                    <div
                        class="pr-5"
                        style="transition:1s all ease; position:relative; top:-100%;"
                        :class="`${subFont}`"
                    >
                        {{sub}}
                    </div>
                </v-col>
            </v-row>
        </v-container>
    -->
    </div>
</template>
<style>
.hyTitle .trans {
    transition: 1s all ease;
}
.hyTitle .trans.ease-out {
    transition-timing-function: ease-out
}
.hyTitle .trans.ease-in {
    transition-timing-function: ease-in;
}
.hyTitle .trans.linear {
    transition-timing-function: linear;
}
</style>
<script>
export default {
    data () {
        return {

        }
    },
    mounted () {
    },
    props: {
        font:String,
        fixed: Boolean,
        position: {type: String, default: 'absolute'},
        positionOptions: String,
        borderTop: {type: Number, default: 0},
        borderBottom: {type: Number, default: 0},
        borderLeft: {type: Number, default: 0},
        borderRight: {type: Number, default: 0},
        borderColor: String,
        main: String,
        mainFont: String,
        sub: String,
        subFont: String,
        sheet: Boolean
    }
}
</script>

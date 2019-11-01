<template>
    <v-container
        class="pa-0"
        fill-height
        v-resize="onResize"
        style="width:100%; overflow: visible;"
    >
        <v-carousel
            cycle
            style="width:100%; position:fixed; top:0px; left:0;"
            vertical-delimiters
            hide-delimiter-background
            :height="height"
        >
            <v-carousel-item
                v-for="(item, i) in carouselItems"
                :key="i"
                :src="item.src"
                reverse-transition="fade-transition"
                transition="fade-transition"
                :style="`${height}px`"
            >
                <v-overlay
                    absolute
                    color="#121212"
                    opacity="0.3"
                >
                </v-overlay>
            </v-carousel-item>
        </v-carousel>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        height: window.innerHeight,
        carouselItems: [
            {
                src: "http://www.koreacubesociety.co.kr/thum_img/koreacub/banner/cb9b5b34b1fede28274bced6588cc13b_water__c3_w1000_h400.png",
                title: "title1"
            },
            {
                src: "http://www.koreacubesociety.co.kr/thum_img/koreacub/banner/1bbf26f83bfa643e7c027ccebe3a4930_water__c3_w1000_h400.png",
                title: "title2"
            }
        ]
    }),
    methods: {
        onResize(){
            this.height = window.innerHeight;
        }
    }
};
</script>

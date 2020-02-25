/**
 * @file PAGE_NAME 页面入口组件
 * @author YOURNAME
 */

import {
    computed,
    Component,
    BaseView,
    suh,
    h,
    c,
} from '@fe/utils/dev-pattern-vm'

import urlUtils from 'utils/url-utils';

import pageStyle from './style.use.less'

@suh(pageStyle)
@Component
export default class MatrixCanvas extends BaseView {

    // 画板
    // canvas;

    constructor() {
        super();
        this.handleWindowScroll = this.handleWindowScroll.bind(this);
    }

    mounted() {
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');

        let matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';

        //converting the string into an array of single characters
        matrix = matrix.split('');

        let fontHeight = MatrixCanvas.FONT_HEIGHT;
        let fontWidth = MatrixCanvas.FONT_WIDTH;

        this.handleWindowScroll();

        let drops = [];
        //x below is the x coordinate
        //1 = y co-ordinate of the drop(same for every drop initially)
        for (let i = 0; i < 5000; i++) {
            drops[i] = -1;
        }

        //drawing the characters
        const draw = () => {

            //Black BG for the canvas
            //translucent BG to show trail
            ctx.fillStyle = `rgba(0, 0, 0, ${this.opacityRefresh})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0'; //green text
            ctx.font = fontHeight + 'px monospace';

            //looping over drops
            for (let i = 0; i < this.dropColumnCount; i++) {
                if (drops[i] === -1) {
                    if (Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    else {
                        continue;
                    }
                }
                //a random chinese character to print
                let text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * fontWidth, drops[i] * fontHeight);

                //sending the drop back to the top randomly after it has crossed the screen
                //adding a randomness to the reset to make the drops scattered on the Y axis
                if (drops[i] * fontHeight > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                //incrementing Y coordinate
                drops[i]++;
            }
        }

        this.drawTimer = setInterval(draw, 50);
        window.addEventListener('resize', this.handleWindowScroll);
    }

    beforeUpdate() {
        this.handleWindowScroll();
    }

    beforeDestory() {
        clearInterval(this.drawTimer);
        window.removeEventListener('resize', this.handleWindowScroll);
    }

    static FONT_HEIGHT = 18;
    static FONT_WIDTH = 16;

    opacityRefresh = 0.04;
    dropColumnCount = 0;

    handleWindowScroll() {
        const canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');

        const currentState = new Image();
        currentState.src = canvas.toDataURL('image/png');

        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;

        // this.opacityRefresh = canvas.height / 10000;

        requestAnimationFrame(() => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(currentState, 0, 0);
        });


        this.dropColumnCount = this.$refs.canvas.width / MatrixCanvas.FONT_WIDTH;
    }

    render(r) {
        h.bindCreateElement(r);
        const { local } = this;

        return h.div(c('matriks-canvas',
            local.isFullScreen ? 'full-screen' : ''),
            {},
            h.canvas({
                ref: 'canvas',
            })
        )
    }
}

import { Howl } from 'howler';

export default class PlaySound {

    private static play(path: string) {
        const sound = new Howl({
            src: [path]
        });
        sound.play();
    }

    public static newOrder() {
        this.play('/assets/sfx/confirm.mp3');
    }

    public static lateOrder() {
        this.play('/assets/sfx/ding.mp3');
    }

    public static newService() {
        this.play('/assets/sfx/warning.mp3');
    }

    public static lateService() {
        this.play('/assets/sfx/ding.mp3');
    }
}
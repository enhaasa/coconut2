// eslint-disable-next-line import/no-anonymous-default-export
export default {
    softElastic: {
        duration: 0.3, 
        opacity: 0, 
        scaleX: 0, 
        scaleY: 0,
        ease: 'back'
    },
    hardElastic: {
        duration: 1, 
        opacity: 0, 
        scaleX: 0, 
        scaleY: 0,
        ease: 'elastic'
    },
    appearY: {
        duration: 0.3,
        scaleY: 0,
        ease: 'back'
    },
    appearYBounce: {
        duration: 1,
        scaleY: 0,
        ease: 'bounce'
    },
    fadeFall: {
        duration: 0.2,
        y: 25,
        opacity: 0
    },
    fadeFast: {
        duration: 0.1,
        opacity: 0
    },
    fadeSlow: {
        duration: 2,
        opacity: 0
    }
}
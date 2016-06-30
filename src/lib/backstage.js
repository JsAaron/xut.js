/**
 * by 2016.6.30
 * judgment is backstage run
 * Take the opposite judgment
 * @return {[type]} [description]
 */
let allowNext = () => {
    if (window.MMXCONFIG) {
        return () => {
            return !window.MMXCONFIG.back
        }
    } else {
        return () => {
            return !false
        }
    }
}

export default allowNext()

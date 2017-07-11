import ReactTestUtils from 'react-dom/test-utils';

/**
 * Wrapper around window.requestAnimationFrame that returns a promise
 * @private
 */
function _waitForFrame() {
    return new Promise((resolve, reject) => {
        window.requestAnimationFrame(() => {
            resolve();
        });
    });
}

const MatrixReactTestUtils = {
    /**
     * Waits a small number of animation frames for a component to appear
     * in the DOM. Like findRenderedDOMComponentWithTag(), but allows
     * for the element to appear a short time later, eg. if a promise needs
     * to resolve first.
     *
     * @return {Promise<ReactComponent>} a (native) promise that resolves once
     *     the component appears, or rejects if it doesn't appear after a
     *     nominal number of animation frames.
     */
    waitForRenderedDOMComponentWithTag: function(tree, tag, attempts) {
        if (attempts === undefined) {
            // Let's start by assuming we'll only need to wait a single frame, and
            // we can try increasing this if necessary.
            attempts = 1;
        } else if (attempts == 0) {
            return Promise.reject("Gave up waiting for component with tag: " + tag);
        }

        return _waitForFrame().then(() => {
            const result = ReactTestUtils.scryRenderedDOMComponentsWithTag(tree, tag);
            if (result.length > 0) {
                return result[0];
            } else {
                return MatrixReactTestUtils.waitForRenderedDOMComponentWithTag(tree, tag, attempts - 1);
            }
        });
    }
};

export default MatrixReactTestUtils;

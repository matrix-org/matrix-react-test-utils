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

/**
 * Helper for waitForRendered(DOM)?Component*
 *
 * `findComponent` should be a callback which returns a list of components which
 * match the condition.
 *
 * @param {Number?} attempts
 * @param {Function} findComponent
 *
 * @return {Promise} a (native) promise that resolves once the component
 *     appears, or rejects if it doesn't appear after a nominal number of
 *     animation frames.
 */
function _waitForRenderedComponent(attempts, findComponent) {
    if (attempts === undefined) {
        // Let's start by assuming we'll only need to wait a single frame, and
        // we can try increasing this if necessary.
        attempts = 1;
    } else if (attempts == 0) {
        return Promise.reject(new Error(
            "Gave up waiting for component",
        ));
    }

    return _waitForFrame().then(() => {
        const result = findComponent();
        if (result.length > 0) {
            return result[0];
        } else {
            return _waitForRenderedComponent(attempts-1, findComponent);
        }
    });
}

const MatrixReactTestUtils = {
    /**
     * Waits a small number of animation frames for a component to appear
     * in the DOM. Like findRenderedDOMComponentWithTag(), but allows
     * for the element to appear a short time later, eg. if a promise needs
     * to resolve first.
     *
     * @return {Promise<ReactDOMComponent>} a (native) promise that resolves once
     *     the component appears, or rejects if it doesn't appear after a
     *     nominal number of animation frames.
     */
    waitForRenderedDOMComponentWithTag: function(tree, tag, attempts) {
        return _waitForRenderedComponent(attempts, () => {
            return ReactTestUtils.scryRenderedDOMComponentsWithTag(tree, tag);
        });
    },

    /**
     * Waits a small number of animation frames for a component to appear
     * in the DOM. Like findRenderedComponentWithType(), but allows
     * for the element to appear a short time later, eg. if a promise needs
     * to resolve first.
     *
     * @return {Promise<ReactComponent>} a (native) promise that resolves once
     *     the component appears, or rejects if it doesn't appear after a
     *     nominal number of animation frames.
     */
    waitForRenderedComponentWithType: function (tree, componentType, attempts) {
        return _waitForRenderedComponent(attempts, () => {
            return ReactTestUtils.scryRenderedComponentsWithType(tree, componentType);
        });
    },
};

export default MatrixReactTestUtils;

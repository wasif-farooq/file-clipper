const promisify = (fn, event = null) => (...params) => {
    return event ? new Promise((resolve, reject) => {

        const callback = (...data) => {
            resolve.apply(null, data);
        }

        const onError = (...data) => {
            reject.apply(null, data);
        }

        fn.on('error', onError);
        fn.on(event, callback);

    }) : new Promise((resolve, reject) => {

        const callback = (...receives) => {
            let [err, ...data] = receives;
            if (err) {
                reject.call(fn, err);
                return;
            }

            resolve.apply(fn, data);
        }

        params.push(callback);

        try {
            fn.apply(null, params);
        } catch (err) {
            reject(err);
        }

    })
}

module.exports = promisify;

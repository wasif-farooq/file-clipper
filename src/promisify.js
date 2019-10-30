const promisify = (fn) => (...params) => {
    return new Promise((resolve, reject) => {

        const callback = (...receives) => {
            let [err, ...data] = receives;
            if (err) {
                reject(err);
                return;
            }

            resolve.apply(null, data);
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

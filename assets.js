exports.getBaseUrl = function(env) {
    if (env === 'production') {
        return 'https://s3.eu-west-3.amazonaws.com/choufleur-brocoli-assets';
    } else {
        return '/assets';
    }
}


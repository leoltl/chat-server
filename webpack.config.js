var path = require('path');
    
module.exports = {
    entry: './src/client/index.js',
    output: {
        path: path.resolve(__dirname, 'public','scripts'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 
                {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
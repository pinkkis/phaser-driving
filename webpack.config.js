const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const {version, distOutput} = require('./buildConfig');

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, process.env.NODE_ENV === 'production' ? 'dist/phaser.min.js' : 'dist/phaser.js');
const threeModule = path.join(__dirname, '/node_modules/three/');
const three = path.join(threeModule, 'build/three.module.js');

module.exports = {
	output: {
		globalObject: 'this',
		path: distOutput,
	},
	entry: {
		game: ['./src/game.ts']
	},
	devtool: process.env.NODE_ENV === 'production' ? undefined : 'eval-source-map',
	module: {
		rules: [{
			test: /\.tsx?$/,
			use: 'babel-loader',
			exclude: /node_modules/
		},
		{
			test: /\.map.js$/,
			use: ["source-map-loader"],
			enforce: "pre"
		},
		{
			test: [/\.vert$/, /\.frag$/],
			use: 'raw-loader'
		},
		{
			test: /.worker.js$/,
			use: [{
				loader: 'worker-loader'
			}]
		},
		{
			test: /\.css$/,
			use: [
				MiniCssExtractPlugin.loader,
				"css-loader"
			]
		},
		{
			test: /phaser\.min\.js$/,
			use: [{
				loader: 'expose-loader',
				options: 'Phaser'
			}]
		},
		{
			test: /\.(eot|svg|ttf|woff|woff2)$/,
			loader: 'file-loader?name=assets/fonts/[name].[ext]'
		}
		]
	},
	plugins: [
		new CleanPlugin(),
		new webpack.DefinePlugin({
			'CANVAS_RENDERER': JSON.stringify(true),
			'WEBGL_RENDERER': JSON.stringify(true)
		}),
		new HtmlWebPackPlugin({
			template: './src/index.html',
			filename: './index.html',
			chunks: ['game', 'vendor'],
			buildType: process.env.NODE_ENV,
			version: version,
			favicon: './src/favicon.ico',
		}),
		new CopyWebpackPlugin([
			{
				from: './assets/',
				to: './assets/'
			},
		], {}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[name].css',
		}),
		new webpack.ProvidePlugin({
			'THREE': 'three',
		})
	],
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			'phaser': phaser,
			'three': three,
		}
	},
	optimization: {
		minimizer: [
			new TerserPlugin(),
			new OptimizeCSSAssetsPlugin()
		],
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'initial'
				}
			}
		}
	},
	watchOptions: {
		ignored: [
			'node_modules',
			'assets/**/*'
		]
	}
};

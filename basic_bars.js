const w = 430
const h = 100
const padding = 1

var SVG = d3.select('#roll_chart_svg')
	.attr('width', w)
	.attr('height', h);
let is_rainbow = document.getElementById('rainbow_check').checked

function roll_dice() {
	is_rainbow = document.getElementById('rainbow_check').checked
	console.log(is_rainbow)
	let max = parseInt(document.getElementById('max').value)
	let rolls = parseInt(document.getElementById('rolls').value)
	let normal = rolls / max
	var dataset = []
	var SVG = d3.select('#roll_chart_svg')

	// SVG = set_max_h(dataset, SVG)
	//if rainbow, just make rdb
	let { r, g, b } = rgb()

	console.log({ max, rolls })
	let rand_arr = make_rand_array(rolls, max)
	dataset = make_bars(rand_arr)//make bars
	console.log(dataset)

	//makes rect per each data
	let rects = SVG.selectAll('rect').data(dataset)
	//deletes rect per removed data
	rects.exit().remove();
	//add rects per added data
	rects.enter().append('rect').merge(rects)
		.attr('x', (_, i) => i * (w / dataset.length))
		.attr('y', d => h - d)
		.attr('height', d => d)

		.attr('width', (w / dataset.length) - padding)

	if (is_rainbow) rects.enter().append('rect').merge(rects)
		.attr("fill", () => rainbow(r, b, g))
	else rects.enter().append('rect').merge(rects)
		.attr("fill", (d) => min_max(d, normal))
add_text(SVG, dataset)

console.log(SVG)




}

function add_text(SVG, dataset) {
	let text = SVG.selectAll('text').data(dataset)
	text.exit().remove();
	text.enter().append('rect').merge(text)
		.append('text')
		.text((_, i) => i)
		.attr('text-anchor', 'middle')
		.attr('x', (d, i) => {
			i + (w / dataset.length)
		})
		.attr('y', (d) => {
			h - d
		})



}

function make_bars(arr) {
	let obj = {}
	for (let x = 0; x < arr.length; x++) {
		if (!obj[arr[x]]) obj[arr[x]] = 0
		obj[arr[x]]++
	}
	obj = Object.values(obj)
	// console.log(obj)
	return obj
}

function rand(max, min) {
	var max = max ? max : 10
	var min = min ? min : 0
	let rand = Math.random()
	let n = Math.floor(rand * max) + min
	console.log(n, rand) 
	return n
}


function make_rand_array(num, max) {
	var max = max || 10
	let arr = []
	for (let i = 0; i < num; i++) {
		let x = rand(max)
		arr.push(x)
	}
	return arr
}

function rgb() {
	let r = rand(1, 1)
	let g = rand(1, 1)
	let b = rand(1, 1)
	return { r, g, b }
}

function rainbow(r, b, g) {
	return `rgb(${Math.floor(rand(256) / r)} ${Math.floor(rand(256) / g)} ${Math.floor(rand(256) / b)})`
}


function min_max(d, normal) {
	const low_threshhold = parseFloat(document.getElementById('low_threshold').value)
	const high_threshhold = parseFloat(document.getElementById('high_threshold').value)
	// console.log({ low_threshhold, high_threshhold })

	if (d > normal + (normal * high_threshhold)) return 'red'
	else if (d < normal - (normal * low_threshhold)) return 'blue'
	else return 'grey'
}

function set_max_h(dataset, SVG) {
	//get max dataset and make SVG.h == to that
	let h = Math.max(dataset)
	console.log(h)
	SVG.attr('height', h)
	return SVG
}
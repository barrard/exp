const w = 400
const h = 100
const padding = 1
let counter = 0

var SVG = d3.select('#roll_chart_svg')
	.attr('width', w)
	.attr('height', h);
let is_rainbow = document.getElementById('rainbow_check').checked
let avg_line_valueavg_line = document.getElementById('avg_line_value')
function roll_dice() {

	counter++
	is_rainbow = document.getElementById('rainbow_check').checked
	console.log({ is_rainbow })
	let max = parseInt(document.getElementById('max').value)
	let rolls = parseInt(document.getElementById('rolls').value)
	let normal = rolls / max
	let rand_arr = make_rand_array(rolls, max)
	var dataset = make_bars(rand_arr)//make bars
	console.log(d3.max(dataset, d => d))
	let yScale = d3.scaleLinear()
		.domain([0, d3.max(dataset, d => d)])
		.range([0, h])

	var SVG = d3.select('#roll_chart_svg')

	// SVG = set_max_h(dataset, SVG)
	//if rainbow, just make rdb
	let { r, g, b } = rgb()

	console.log({ max, rolls })
	console.log(dataset)

	//makes rect per each data
	let rects = SVG.selectAll('rect').data(dataset)
	// console.log(w / dataset.length)
	//deletes rect per removed data
	rects.exit().remove();
	//add rects per added data
	rects.enter().append('rect').merge(rects)
		.attr('x', (_, i) => i * (w / dataset.length))
		.attr('y', d => h - yScale(d))
		.attr('height', d => yScale(d))
		.attr('width', (w / dataset.length) - padding)
		.attr('fill', (d) => {
			if (is_rainbow)
				return rainbow(r, b, g)
			else
				return min_max(d, normal)
		})
	console.log('test1');

	console.log('test2')

	add_text(SVG, dataset, yScale)
	draw_avg_line(SVG, normal, yScale)

	draw_line_chart('line_chart', dataset)
	draw_vertical_chart('vertical_bar_chart', dataset)
}
// setInterval(()=>roll_dice(),2000)

function draw_vertical_chart(id, _data) {
	const w = 200,
		h = 400
	let max = parseInt(document.getElementById('max').value)
	let rolls = parseInt(document.getElementById('rolls').value)
	let normal = rolls / max
	const margin = {
		left: 20, top: 20, right: 20, bottom: 20
	}
	const innerWidth = w - margin.left - margin.right
	const innerHeight = h - margin.top - margin.bottom
	console.log(_data)
	let sortable_results = []
	_data.map((result, i) => sortable_results.push({ number: i, count: result }))

	sortable_results.map(r => console.log(r))
	sortable_results.sort(function (a, b) {
		return b.count - a.count;
	});
	console.log(sortable_results)
	data = sortable_results
	const SVG = d3.select(`#${id}`)
		.attr('width', w)
		.attr('height', h).attr('class', 'vertical-bar-border')

	let inner = SVG.select('.vertical-bar-inner')



	const xValue = d => d.count
	const yValue = d => innerHeight - d.number

	let xScale = d3.scaleLinear()
		.domain([0, d3.max(data, xValue)])
		.range([0, innerWidth])

	let yScale = d3.scaleLinear()
		.domain([0, max])
		.range([0, innerHeight])
	

	if (!inner._groups[0][0]) {
		inner = SVG.append('g')
			.attr('class', 'vertical-bar-inner')
			.attr('transform', `translate(${margin.left}, ${margin.top})`)
		inner.append('g').call(d3.axisLeft(yScale))
		inner.append('g').call(d3.axisBottom(xScale))
			.attr('transform', `translate(${0}, ${innerHeight})`)
	}


	let rects = inner.selectAll('rect').data(data)
	// console.log(w / dataset.length)
	//deletes rect per removed data
	rects.exit().remove();
	//add rects per added data
	rects.enter().append('rect').merge(rects)
		.attr('y', (_, i) => i * (innerHeight / data.length))
		.attr('x', (d) => innerWidth - xScale(xValue(d)))
		.attr('height', (innerHeight / data.length) - padding)
		.attr('width', (d) => xScale(xValue(d)))
		.attr('fill', (d) => {
			if (is_rainbow)
				return rainbow(r, b, g)
			else
				return min_max(xValue(d), normal)
		})
	let bar_data = inner.selectAll('.bar_data').data(dataset)

	let enter_bar_data = bar_data.enter().append('g').attr('class', 'bar_data')

	enter_bar_data.append('text').attr('class', 'number_label')

	enter_bar_data.append('text').attr('class', 'value_label')
	bar_data.merge(enter_bar_data).select('.number_label')
		.attr('x',  innerWidth)
		.attr('y', (d) => innerHeight - yScale(yValue(d)))
		// .attr('text-anchor', 'middle')
		.attr('font-size', 10)
		// .text((_, i) => i)
		.text((d) => d)


	bar_data.merge(enter_bar_data).select('.value_label')
		.attr('x',  0)
		.attr('y', (d) => innerHeight - yScale(yValue(d)))
		.attr('text-anchor', 'middle')
		.attr('font-size', 10)
		.attr('fill', 'white')
		.text((_, i) => i)


	bar_data.exit().remove();



}

function draw_line_chart(id, data) {
	let SVG = d3.select(`#${id}`)
		.attr('width', w)
		.attr('height', h)
	let line = d3.line()
		.x((_, i) => i * (w / data.length))
		.y((d) => h - d)
	// .interpolate('linear')

	SVG.append('path')
		.data([data])
		.attr('d', line(data))
		.attr('stroke', "purple")
		.attr("stroke-width", 2)
		.attr('fill', 'none')


}

function draw_avg_line(SVG, avg, yScale) {
	avg_line_value.innerHTML = avg
	let avg_line = SVG.selectAll('line.avg_line')
	if (!avg_line) {
		SVG.append("line").attr('class', 'avg_line')
	}
	else {
		avg_line.remove()
		avg_line = SVG.append("line").attr('class', 'avg_line')
	}

	avg_line
		.attr('stroke-dasharray', "5, 5")
		.attr("x1", 0)
		.attr("y1", h - yScale(avg))
		.attr("x2", w)
		.attr("y2", h - yScale(avg))
		.attr("stroke-width", 3)
		.attr("stroke", "black");

}


function add_text(SVG, dataset, yScale) {
	const font_height = 5
	let bar_data = SVG.selectAll('.bar_data').data(dataset)
	// console.log('does this run??????')
	let enter_bar_data = bar_data.enter().append('g').attr('class', 'bar_data')

	enter_bar_data.append('text').attr('class', 'index_label')

	enter_bar_data.append('text').attr('class', 'value_label')

	bar_data.merge(enter_bar_data).select('.index_label')
		.attr('x', (d, i) => i * (w / dataset.length) + (w / dataset.length - padding) / 2)
		.attr('y', (d) => h - yScale(d))
		.attr('text-anchor', 'middle')
		.attr('font-size', 10)
		// .text((_, i) => i)
		.text((d) => d)


	bar_data.merge(enter_bar_data).select('.value_label')
		.attr('x', (d, i) => i * (w / dataset.length) + (w / dataset.length - padding) / 2)
		.attr('y', (d) => h)
		.attr('text-anchor', 'middle')
		.attr('font-size', 10)
		.attr('fill', 'white')
		.text((_, i) => i)


	bar_data.exit().remove();



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
	// console.log(n, rand) 
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

// function set_max_h(dataset, SVG) {
// 	//get max dataset and make SVG.h == to that
// 	let h = Math.max(dataset)
// 	console.log(h)
// 	SVG.attr('height', h)
// 	return SVG
// }
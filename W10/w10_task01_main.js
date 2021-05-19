/*var data = [100,50,80,20];

var svg = d3.select('#drawing_region');
update( data );

function update(data) {
    let padding = 10;
    let height = 20;

    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .transition().duration(1000)
        .attr("x", padding)
        .attr("y", (d,i) => padding + i * ( height + padding ))
        .attr("width", d => d)
        .attr("height", height);
}

d3.select('#reverse')
    .on('click', d => {
        data.reverse();
        update(data);
    });
*/

d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W10/covid19_20210518.csv")
    // 出典：https://web.sapmed.ac.jp/canmol/coronavirus/japan.html
    .then( data => {
        data.forEach( d => { d.prefecture = d.prefecture; d.number = +d.number; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 256,
            margin: {top:25, right:10, bottom:50, left:100},
            title: '7日間の新規感染者数(人口100万人あたり)',
            xlabel: '都道府県',
            ylabel: '人数'
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });
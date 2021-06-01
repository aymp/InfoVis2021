// 3Dscatter
d3.csv("https://aymp.github.io/InfoVis2021/W10/covid19_20210518.csv")
    // 出典：https://web.sapmed.ac.jp/canmol/coronavirus/japan.html
    .then( data => {
        data.forEach( d => { d.label = d.prefecture; d.value = +d.number; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 256,
            margin: {top:30, right:10, bottom:50, left:100},
            title: '7日間の新規感染者数(人口100万人あたり) *2021.05.19時点',
            xlabel: '人口100万人あたりの人数',
            ylabel: '都道府県(近畿)' 
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();

        d3.select('#reverse')
        .on('click', d => {
            data.reverse();
            bar_chart.update();
        })

        d3.select('#descend')
        .on('click', d => {
            data.sort(function(a,b){return d3.descending(a.value,b.value)});
            bar_chart.update();
        })

        d3.select('#ascend')
        .on('click', d => {
            data.sort(function(a,b){return d3.ascending(a.value,b.value)});
            bar_chart.update();
        })
    
    })
    .catch( error => {
        console.log( error );
    });
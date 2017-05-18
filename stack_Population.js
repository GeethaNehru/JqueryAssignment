 $(document).ready(function(){
    create();
  
  let $Country=$('#Country');
  let $Population_2010=$('#Population_2010');
    let $Population_2011=$('#Population_2011');
      let $Population_2012=$('#Population_2012');
        let $Population_2013=$('#Population_2013');

 let $sample=$('#sample');

  $.ajax({
        type:'GET',
        url:'http://localhost:3000/Country',
        dataType:"json",
        
      success:function(data){
            $.each(data,function(i,item){
                $sample.append('<tr><td>'+item.Country+'</td><td>'+item.Population_2010+'</td><td>'+item.Population_2011+'</td><td>'+item.Population_2012+'</td><td>'
                  +item.Population_2013+'</td><td><button id="'+item.Country+
                  '" type="button" class="remove">Delete</button></td></tr>');
            });
        }
    });

  $('#add_value').on('click',function(){
        var item={
            Country: $Country.val(),
            Population_2010:$Population_2010.val(),
            Population_2011:$Population_2011.val(),
            Population_2012:$Population_2012.val(),
            Population_2013:$Population_2013.val(),
          }
        
      $.ajax({
            type:'POST',
            url:' http://localhost:3000/Country',
            data:item,
            dataType:"json",
            
            success: function(x){
                
              $sample.append('<tr><td>'+x.Country+'</td><td>'+x.Population_2010+'</td><td>'
                  +x.Population_2011+'</td><td>'+x.Population_2012+'</td><td>'
                  +x.Population_2013+'</td><td><button id="'+x.Country+
                  '" type="button" class="remove">Delete</button></td></tr>');
              $('svg').remove();
              create();



            
          }

            
        });
    });

$sample.delegate('.remove','click',function(){
            var $tr = $(this).closest('tr');
               $.ajax({
                type: 'DELETE',
                url: 'http://localhost:3000/Country/'+$(this).attr('id'),
               
                success: function(){
                    $tr.remove();
                    $('svg').remove();
                    create();

                }
            });

        });   
function create()
 {let margin={top:40, bottom:100, left:100, right:150},
    width=1500-margin.left-margin.right,
    height=600-margin.top-margin.bottom;

  let horizontal=d3.scale.ordinal().rangeRoundBands([0,width],0.10),
    vertical=d3.scale.linear().rangeRound([height,0]);

  let color = d3.scale.ordinal().range(["#383535","#575050","#B0A9A9", "#F2E6E6"]);

  let xAxis=d3.svg.axis()
    .scale(horizontal)
    .orient("bottom");

  let yAxis=d3.svg.axis()
    .scale(vertical)
    .orient("left");

  let svg=d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  d3.json("http://localhost:3000/Country",function(data){
  data.forEach(function(d){
    d.Country=d.Country;
    d.Population_2010=parseInt(d.Population_2010);
    d.Population_2011=parseInt(d.Population_2011);
    d.Population_2012=parseInt(d.Population_2012);
    d.Population_2013=parseInt(d.Population_2013);     
    

  });
  let xData=["Population_2010","Population_2011","Population_2012","Population_2013"];
  let dataIntermediate = xData.map(function (c) {
        return data.map(function (d) {
            return {x: d.Country, y: d[c]};
        });
    });
  let dataStackLayout = d3.layout.stack()(dataIntermediate);

  horizontal.domain(dataStackLayout[0].map(function (d) {
        return d.x;
    }));
  vertical.domain([0,
        d3.max(dataStackLayout[dataStackLayout.length - 1],
                  function (d) { return d.y0 + d.y;})
      ])
      .nice();
  let layer = svg.selectAll(".stack")
          .data(dataStackLayout)
          .enter().append("g")
          .attr("class", "stack")
          .style("fill", function (d, i) {
                return color(i);
    });

  layer.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")

        .attr("x", function (d) {
            return horizontal(d.x);
          })
          .attr("y", function (d) {
              return vertical(d.y + d.y0);
          })
          .attr("height", function (d) {
              return vertical(d.y0) - vertical(d.y + d.y0);
        })
          .transition().duration(800)
    .delay( function(d,i) { return i * 50; })



        
      .attr("width", horizontal.rangeBand());

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-60)")
        .style("text-anchor", "end")
        .attr("font-size", "10px");
        //.text("Country")



      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("dy", "-5em")
        .style("text-anchor", "middle")
        .text("In Millions");
       
         let legend = svg.selectAll(".legend")
         .data(color.domain().slice())
       .enter().append("g")
         .attr("class", "legend")
         .attr("transform", function(d, i) { return "translate(0," + i * 30 +  ")"; });
    
     legend.append("rect")
         .attr("x", width - 18)
         .attr("width", 18)
         .attr("height", 18)
         .style("fill", color);

     legend.append("text")
     .attr("x", width - 24)
         .attr("y", 9)
         .attr("dy", ".35em")
         .style("text-anchor", "end")
         .style("fill","white")
         .text(function(d,i) { return xData[i]; });

  });

}
});
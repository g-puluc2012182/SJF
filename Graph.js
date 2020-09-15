    // Themes begin
	am4core.useTheme(am4themes_dataviz);
	am4core.useTheme(am4themes_animated);
	// Themes end
    
    function plotGraph(Varray){
	var chart = am4core.create("chartdiv", am4charts.XYChart);
    
    chart.data = Varray;

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "name";
	categoryAxis.renderer.inversed = true;
	categoryAxis.renderer.grid.template.location = 0;
	
	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	valueAxis.renderer.minGridDistance = 50;
	
	var columnSeries = chart.series.push(new am4charts.ColumnSeries());
	columnSeries.dataFields.categoryY = "name";
	columnSeries.dataFields.valueX = "endTime";
	columnSeries.dataFields.openValueX = "startTime";
	columnSeries.columns.template.tooltipText = "[bold]{categoryY}[/]\ninicia en {openValueX}\ntermina en {valueX}";
	
	var columnTemplate = columnSeries.columns.template;
	columnTemplate.strokeOpacity = 0;
	columnTemplate.propertyFields.fill = "color";
    columnTemplate.height = am4core.percent(100);
}
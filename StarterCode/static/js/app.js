d3.json("samples.json").then((bbData) => {
  window.bbData = bbData;
  console.log(bbData);
  var data = bbData;

  // Add Test subject IDS to dropdown menu
  var idList = data.names;
  for (var i = 0; i < idList.length; i++) {
    selectBox = d3.select("#selDataset");
    selectBox.append("option").text(idList[i]);
  }

  
  // Set default
  updatePlots(0)

  // update plots   
  function updatePlots(index) {


    // Array of Data for charts
    var otuids = data.samples[index].otu_ids;
    console.log(otuids);
    var sampleValues = data.samples[index].sample_values;
    var otuLabels = data.samples[index].otu_labels;


    // Populate Data card
    var demoKeys = Object.keys(data.metadata[index]);
    var demoValues = Object.values(data.metadata[index])
    var demographicData = d3.select('#sample-metadata');

    // clear demo card data
    demographicData.html("");
    for (var i = 0; i < demoKeys.length; i++) {
      demographicData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
    };


    // Slice and reverse data for bar chart
    var topTenOTUS = otuids.slice(0, 10).reverse();
    var topTenFreq = sampleValues.slice(0, 10).reverse();
    var topTenToolTips = data.samples[0].otu_labels.slice(0, 10).reverse();
    var topTenLabels = topTenOTUS.map((otu => "OTU " + otu));
    var reversedLabels = topTenLabels.reverse();

    // Set up trace for bar chart
    var trace1 = {
      x: topTenFreq,
      y: reversedLabels,
      text: topTenToolTips,
      name: "",
      type: "bar",
      orientation: "h"
    };

    // data
    var barData = [trace1];

    // Apply  layout
    var layout = {
      title: "Top 10 OTUs",
      margin: {
        l: 75,
        r: 75,
        t: 75,
        b: 50
      }
    };

    // Render the plot "bar"
    Plotly.newPlot("bar", barData, layout);

    
    // Set up trace for bubble
    trace2 = {
      x: otuids,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuids,
        opacity: [1, 0.8, 0.6, 0.4],
        size: sampleValues
      }
    }

    //data
    var bubbleData = [trace2];

    // Apply layout
    var layout = {
      title: 'OTU Bubble',
      showlegend: false,
      height: 600,
      width: 930
    }
     // Render the plot "bubble"
    Plotly.newPlot("bubble", bubbleData, layout);
    

  }

  // On button click, call refreshData()
  d3.selectAll("#selDataset").on("change", refreshData);



  function refreshData() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var personsID = dropdownMenu.property("value");
    console.log(personsID);
    // Initialize an empty array for the person's data
    console.log(data)

    for (var i = 0; i < data.names.length; i++) {
      if (personsID === data.names[i]) {
        updatePlots(i);
        return
      }
    }
  }

});

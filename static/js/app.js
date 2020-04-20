function init() {
    let ddID = d3.select('#selDataset');

    d3.json('samples.json').then(data => {
        data.names.forEach(id => {
            ddID.append('option').attr('value', id).text(`BB ${id}`);
        });
        //  ** Grab "Default" Demographic Information **
        let filteredDemographics = data.metadata.filter(demo => demo.id == data.names[0]);
        d3.select('#sample-metadata').html('')

        //  ** Display "Default" Demographic Information **
        Object.entries(filteredDemographics[0]).forEach(([key, value]) => {
            d3.select('#sample-metadata').append('p').text(`${key}: ${value}`);
        });
        
    
        // ** Grab "Default" Graphing Data **
        let filteredSamples = data.samples.filter(sample => sample.id == data.names[0]);

         // ** Create "Default" Bar Graph **
        let top10otu = filteredSamples[0].otu_ids.splice(0, 10);
        let otuIds = top10otu.map(id => `OTU ${id}`)
        let sampleValues = filteredSamples[0].sample_values.splice(0, 10);
        
        let barTrace = {
            y: otuIds,
            x: sampleValues,
            type: 'bar',
            hovertext: filteredSamples[0].otu_labels,
            orientation: 'h',
        };
        let barlayout = { title: "Top 10 OTU's in subject" }
        let barData = [barTrace];

        Plotly.newPlot('bar', barData, barlayout);

    
        let bubTrace = {
            x: filteredSamples[0].otu_ids,
            y: filteredSamples[0].sample_values,
            mode: 'markers',
            text: filteredSamples[0].otu_labels,
            marker: {
                size: filteredSamples[0].sample_values,
                color: filteredSamples[0].otu_ids
            }
        }    
    
        let bubData = [bubTrace];

        Plotly.newPlot('bubble', bubData)
    });
};
init();

function optionChanged() {

    // ** Get the value of what was selected from dropdown
    let idSelect = d3.select('#selDataset').node().value;
    filterData(idSelect);
};
function filterData(idSelected) {
    d3.json('samples.json').then(obj => {
        // ** Grab the Demographic with the matching ID that was selected
        let filteredDemographics = obj.metadata.filter(demo => demo.id == idSelected);
        
        // ** Grab the Sample Data with the matching ID that was selected
        let filteredSamples = obj.samples.filter(sample => sample.id == idSelected);

        // ** All the whole object with all the information for bubble plot
        let sampleValuesAll = filteredSamples[0]

        //  **Pull out the top 10 otu's per ID + formatting
        let top10otu = filteredSamples[0].otu_ids.splice(0, 10);
        let otuIds = top10otu.map(id => `OTU ${id}`)

        //  **Pull sample and label values for top 10 otu's per ID
        let sampleValues = filteredSamples[0].sample_values.splice(0, 10)
        let otuLabels = filteredSamples[0].otu_labels.splice(0, 10)
        
        updateDemographic(filteredDemographics);
        updateBar(sampleValues, otuIds, otuLabels);
        updateBubble(sampleValuesAll);
        // buildGauge(filteredDemographics);    
    });
};

function updateDemographic(demo) {
    // Select Demographic Info container
    d3.select('#sample-metadata').html('')

    // Add Object values into the HTML
    Object.entries(demo[0]).forEach(([key, value]) => {
        d3.select('#sample-metadata').append('p').text(`${key}: ${value}`);
    });

};

function updateBar(x, y, text) { 

    Plotly.restyle("bar", "x", [x]);
    Plotly.restyle("bar", "y", [y]);
    Plotly.restyle("bar", "hovertext", [text]);
};

function updateBubble(graphData) {
    
    Plotly.restyle("bubble", "x", [graphData.otu_ids]);
    Plotly.restyle("bubble", "y", [graphData.sample_values]);
    Plotly.restyle("bubble", "text", [graphData.otu_labels]);
    Plotly.restyle("bubble", {'marker.size': [graphData.sample_values]});
    Plotly.restyle("bubble", {'marker.color': [graphData.otu_ids]});
};
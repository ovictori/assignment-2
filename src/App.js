import React from "react";
//import { csv } from "d3-fetch";
import { useFetch } from "./hooks/useFetch";
import { scaleLinear } from "d3-scale";
import {extent, max, min, bin} from "d3-array";
import { geoNaturalEarth1 } from "d3-geo-projection"
const viewHeight = 500;
const viewWidth = 500;

//April 15th lecture:
//1. push csv to github
//2. use fetch api to use it in your app
//3. make sure data is in your root, push it to your repository, select it raw, copy githubcontent link.

const App = () => {
    //this is from April 20th lecture: storing the data in state
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/ovictori/redo1/main/weather.csv"
    );
    console.log("from hook ", loading, data);
    /* this is from April 15th lecture
    csv("https://raw.githubusercontent.com/ovictori/redo1/main/weather.csv")
    .then((data) => console.log(data))
   */
    const size = 500;
    const margin = 20;
    const axisTextAlignmentFactor = 3;

    console.log("d3", d3.geoNaturalEarth1);

    const projection = d3.geoNaturalEarth1();
    const path = d3.geoPath(projection);

    https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json
    console.log(path);

    const dataSmallSample = data.slice(0,300);
    const maxofTMAX = max([1, 2, 3]);
    console.log(dataSmallSample);

    //here is the hard way to find the scale of a data set: find min and max
    //max is the d3 array looper of max in the array
    const maxValueOfTMAX = max(
        dataSmallSample.map((measurement) => {
            return +measurement.TMAX;
        })
    );
    //plus transforms all values into numbers

    const minValueOfTMAX = min(
        dataSmallSample.map((measurement) => {
            return +measurement.TMAX;
        })
    );

        console.log(minValueOfTMAX);
    //here is the way with EXTENT
/*
    extent(dataSmallSample, (measurement) = {
        return measurement.TMAX;
    }); */
    const yScale= scaleLinear()
    .domain([minValueOfTMAX, maxValueOfTMAX]) //mapping min to max
    .range([size, size-250]); //to this range
        //for more info goto leacture 4.15 at 45 min and code
    //you can take this range to adjust the axis positions! //4
    //axis text alignment factor takes the 0,100 labels and pushes them up to be level with the tick marsk

  //bin1 = f(r);
  
  //BINNING 4/22 lecture
 const _bins = bin().thresholds(30); //call bin i guess?
const tmaxBins = _bins(
 // bin takes an array: aka map of the csv.
  dataSmallSample.map((d) => {
    return +d.TMAX;
    })
//returns a data structure used for histos
);
//here we print out the bins and their indicies
console.log(tmaxBins);
console.log(tmaxBins.map((bin, i) => { console.log(i, bin.x0, bin.x1, bin)}));
//returns x0, x1 for indicie of first wall of bin and second

//4.22 lecturea t 59 min he talks about when outliers don't show
    return (
          <div>
            <h1>Exploratory Data Analysis, Assignment 2, INFO 474 SP 2021</h1>
            <p>{loading && "Loading data!"}</p>





            <h3>working witih geographic data</h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
            
            </svg>




            <h3>histogram:</h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
            {tmaxBins.map((bin, i) => { 
              return(
              <rect 
              y={size - 50 - bin.length} 
              width="5" 
              height={bin.length}
              x={100 + i * 6}/>
              );
            })}
            </svg>


















            <h3>Scatterplot</h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
              {dataSmallSample.map((measurement, index) => {
                  //slice slices off the first 100 elements of the data imported by fetch
                  //index is generated by the map. we can use the index generated as the key in the svg
                  //removing fill removes many pixels!
                const highlight = measurement.station === "KALISPELL GLACIER AP";
                return (
                  <circle
                    key={index}
                    //tmin by tmax per datum creates a nice scatterplot
                    cx={100 - measurement.TMIN}
                    cy={size - margin - measurement.TMAX}
                    r="3"
                    fill="none"
                    stroke={highlight ? "red" : "steelblue"}
                    strokeOpacity="0.2"
                  />
                );
              })}
            </svg>
            <h3>
              Barcode plot TMAX at Kalispell Glacier (sounds cold, expect it to be
              lower than average)
            </h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
              <text
                x={size / 2 - 12}
                textAnchor="end"
                y={size - margin + axisTextAlignmentFactor}
                style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
              >
                0
              </text>
            
              <text
              //scale
                x={size / 2 - 12}
                textAnchor="end"
                y={size - margin - 100 + axisTextAlignmentFactor}
                style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
              >
                100
              </text>
              <line
                x1={size / 2 - 10}
                y1={size - margin - 100}
                x2={size / 2 - 5}
                y2={size - margin - 100}
                stroke={"black"}
              />
              <line
                x1={size / 2 - 10}
                y1={size - margin}
                x2={size / 2 - 5}
                y2={size - margin}
                stroke={"black"}
              />
              {data.slice(0, 1000).map((measurement, index) => {
                const highlight = measurement.station === "KALISPELL GLACIER AP";
                return (
                  <line
                    key={index}
                    x1={size / 2}
                    y1={yScale(measurement.TMAX)}
                    x2={size / 2 + 20}
                    y2={yScale(measurement.TMAX)}
                    stroke={highlight ? "red" : "steelblue"}
                    strokeOpacity={highlight ? 1 : 0.1}
                  />
                );
              })}
            </svg>
            <h3>
              TMAX at Kalispell Glacier (sounds cold, expect it to be lower than
              average)
            </h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
              {dataSmallSample.map((measurement, index) => {
                const highlight = measurement.station === "KALISPELL GLACIER AP";
                return (
                  <circle
                    key={index}
                    cx={highlight ? size / 2 : size / 2 - 20}
                    cy={size - margin - measurement.TMAX}
                    r="3"
                    fill="none"
                    stroke={highlight ? "red" : "steelblue"}
                    strokeOpacity="0.2"
                  />
                );
              })}
            </svg>
            <h3>Rendering circles :) this shows a distribution of TMAX</h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
              {data.slice(0, 300).map((measurement, index) => {
                return (
                  <circle
                    key={index}
                    cx={size / 2}
                    cy={size - margin - measurement.TMAX}
                    r="3"
                    fill="none"
                    stroke={"steelblue"}
                    strokeOpacity="0.2"
                  />
                );
              })}
            </svg>
          </div>
        );
      };


export default App;
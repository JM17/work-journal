import type { NumberValue } from "d3";
import * as d3 from "d3";
import useMeasure from "react-use-measure";
import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
} from "date-fns";
import { motion } from "framer-motion";
import NavButton, { BackIcon } from "~/components/buttons/nav-button";

export default function GraphIndexRoute() {
  const entries = [
    { date: "2021-04-03", value: 75 },
    { date: "2021-02-12", value: 20 },
    { date: "2021-02-03", value: 30 },
    { date: "2021-02-04", value: 90 },
    { date: "2021-03-12", value: 10 },
    { date: "2021-03-04", value: 40 },
  ];

  return (
    <div className={"mx-auto max-w-6xl py-8 lg:py-16"}>
      <div className={"m-10"}>
        <NavButton to={`/`} label={"Home"} leftIcon={<BackIcon />} />
        <div className="pb-6 sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Timeline Graph
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
            A graph that shows the progress of a goal over time. A D3.js Framer
            Motion Tailwind CSS example.
          </p>
        </div>
        <Chart entries={entries} />
      </div>
    </div>
  );
}

type Entry = {
  date: string;
  value: number;
};

function Chart({ entries }: { entries: Entry[] }) {
  const [ref, bounds] = useMeasure();

  if (!entries.length)
    return (
      <div className={"flex h-full w-full items-center justify-center"}>
        <p className={"text-gray-500 dark:text-gray-400"}>No entries yet.</p>
      </div>
    );

  let data = entries
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((d) => ({ date: parseISO(d.date), value: d.value }));

  return (
    <div className={"relative h-full w-full text-blue-500"} ref={ref}>
      {bounds.width > 0 && (
        <ChartInner data={data} width={bounds.width} height={bounds.height} />
      )}
    </div>
  );
}

type DataPoint = {
  date: Date;
  value: number;
};

function ChartInner({
  data,
  width,
  height,
}: {
  data: DataPoint[];
  width: number;
  height: number;
}) {
  let margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 20,
  };

  let startDay = startOfMonth(data.at(0).date);
  let endDay = endOfMonth(data.at(-1).date);
  let months = eachMonthOfInterval({ start: startDay, end: endDay });

  // this scales the data to fit the SVG viewbox
  let xScale = d3
    .scaleTime()
    // this is d3 function that returns the min and max of an array
    //.domain(d3.extent(data.map((d) => d.date)))
    .domain([startDay, endDay])
    .range([margin.left, width - margin.right]);

  let domainData = data.map((d) => d.value);

  // this scales the data to fit the SVG viewbox
  let yScale = d3
    .scaleLinear()
    .domain(d3.extent(domainData) as Iterable<NumberValue>)
    // this is flipped because SVG has 0,0 in the top left, not bottom left
    .range([height - margin.bottom, margin.top]);

  let line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));
  let d = line(data);

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      {/** X axis */}
      {months.map((month, i) => (
        <g
          key={month.getMonth()}
          className={"text-gray-400"}
          transform={`translate(${xScale(month)},0)`}
        >
          {i % 2 === 1 && (
            <rect
              width={xScale(endOfMonth(month)) - xScale(month)}
              height={height - margin.bottom}
              fill={"currentColor"}
              className={"text-gray-800"}
            />
          )}
          <text
            x={(xScale(endOfMonth(month)) - xScale(month)) / 2}
            y={height}
            className={"text-[10px]"}
            fill={"currentColor"}
            textAnchor={"middle"}
          >
            {format(month, "MMM")}
          </text>
        </g>
      ))}

      {/** Y axis */}
      {yScale.ticks(5).map((tick) => (
        <g
          key={tick}
          className={"text-gray-400"}
          transform={`translate(0,${yScale(tick)})`}
        >
          <line
            x1={margin.left}
            x2={width - margin.right}
            stroke={"currentColor"}
            strokeWidth={0.5}
            strokeDasharray={"1,5"}
          />
          <text
            alignmentBaseline={"middle"}
            className={"text-[10px]"}
            fill={"currentColor"}
          >
            {tick}
          </text>
        </g>
      ))}
      {/** Line */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, type: "spring", delay: 0.5 }}
        d={d}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={2}
      />

      {/** Circles */}
      {data.map((d, i: number) => (
        <motion.circle
          key={d.date.getDate()}
          cx={xScale(d.date)}
          cy={yScale(d.value)}
          r={5}
          fill={"currentColor"}
          stroke={
            months.findIndex((m) => isSameMonth(m, d.date)) % 2 === 1
              ? // this could be done with tailwind
                "#262626"
              : "#181818"
          }
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", delay: i * 0.1 }}
        />
      ))}
    </svg>
  );
}
